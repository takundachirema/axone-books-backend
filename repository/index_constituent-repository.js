var BetaModel = require('../model/beta-model').default;
var SubSectorModel = require('../model/sub_sector-model').default;
var EquityDataModel = require('../model/equity_data-model').default;
var IndexConstituentModel = require('../model/index_constituent-model').default;

import {sequelize} from '../api/config/db';

class IndexConstituent {

    constructor(date, alpha) {
      this.date = date;
      this.alpha = alpha;
      this.weight = 0;
    }

    static async getConstituentBetaData(date){
        var results = {"success":0};
        results["data"] = {}
        var betaAttributes = ['StartDate','Date','IndexCode','Beta','DataPoints','DaysTraded']
        var betaDates;
        
        // Get all dates
        await BetaModel.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('Date')), 'Date']],
            order: [[ 'Date', 'DESC' ]]
        })
        .then(function(dates){
            console.log("**** index rep dates "+JSON.stringify(dates));
            betaDates = dates;
        })
        .catch(function (err) {
            results["message"] = err;
            console.log("*** dates error "+err)
        });

        if (date === undefined) {
            date = betaDates[0]['Date']
        }

        await IndexConstituentModel.findAll({
            include: [
                {model: SubSectorModel, as: 'ICBSubSector'},
                {model: BetaModel, attributes: betaAttributes, required: true}
            ],
            where: sequelize.literal
            (
                " MONTH([Beta].[Date]) = MONTH('"+date+"') AND YEAR([Beta].[Date]) = YEAR('"+date+"') AND"+
                " MONTH([IndexConstituent].[Date]) = MONTH('"+date+"') AND YEAR([IndexConstituent].[Date]) = YEAR('"+date+"')"
            )
        })
        .then(function(constituentBetaModels){
            console.log("** beta data "+constituentBetaModels.length);
            
            var constituentBetas = IndexConstituent.prepareConstituentBetaData(constituentBetaModels)

            results["success"] = 1
            results["message"] = "Successful"
            results["data"]["dates"] = betaDates
            results["data"]["betas"] = constituentBetas
        }).catch(function (err) {
            console.log("*** error beta data: "+err);
            results["message"] = err
        });

        return results
    }

    /**
     * Each constituent will have an array of betas (each for a different index) for the date that was passed
     * This methods gets those betas and makes one entry that has all the betas
     * @param {*} constituentBetaModels 
     */
    static prepareConstituentBetaData(constituentBetaModels){

        var constituentBetas = {}

        //console.log('** cbm: '+JSON.stringify(constituentBetaModels[0]))
        for (var i = 0; i < constituentBetaModels.length; i++) {
            var code = constituentBetaModels[i]['Alpha'];
            var name = constituentBetaModels[i]['Instrument'];
            var betaModels = constituentBetaModels[i]['Beta'];
            var subSectors = constituentBetaModels[i]['ICBSubSector']

            constituentBetas[code] = {}
            constituentBetas[code]['InstrumentCode'] = code
            constituentBetas[code]['InstrumentName'] = name
            constituentBetas[code]['Industry'] = subSectors['Industry']
            constituentBetas[code]['SuperSector'] = subSectors['SuperSector']
            constituentBetas[code]['Sector'] = subSectors['Sector']
            constituentBetas[code]['SubSector'] = subSectors['SubSector']

            for (var j = 0; j < betaModels.length; j++){
                var betaModel = betaModels[j];
                var index = betaModel['IndexCode']
                constituentBetas[code][index] = parseFloat(betaModel['Beta']).toFixed(2)
            }

            constituentBetas[code]['FirstTrade'] = betaModels[0]['StartDate']
            constituentBetas[code]['LastTrade'] = betaModels[0]['Date']
            constituentBetas[code]['DataPoints'] = betaModels[0]['DataPoints']
            constituentBetas[code]['DaysTraded'] = parseFloat(betaModels[0]['DaysTraded']).toFixed(2)
            constituentBetas[code]['SubSectorCode'] = subSectors['SubSectorCode']
            constituentBetas[code]['IndustryCode'] = subSectors['IndustryCode']
            constituentBetas[code]['SuperSectorCode'] = subSectors['SuperSectorCode']
            constituentBetas[code]['SectorCode'] = subSectors['SectorCode']
        }

        return Object.values(constituentBetas)
    }

    static getConstituents(constituentModels) {
        var constituents= {};
        var totalCap = 0;
        for (var i = 0; i < constituentModels.length; i++) {
            var constituentModel = constituentModels[i];
            totalCap = totalCap + constituentModel.Gross_Market_Capitalisation;

            var constituent = new IndexConstituent(constituentModel["Date"],constituentModel["Alpha"]);
            constituent.Instrument = constituentModel["Instrument"]
            constituent.grossMarketCapitalisation = constituentModel.Gross_Market_Capitalisation;
            constituents[constituentModel["Alpha"]] = constituent;
        }

        //console.log("*** totalCap "+totalCap);
        // put in the weights and sort by that
        for (var key in constituents) {
            var constituent = constituents[key];
            constituent.totalCapitalisation = totalCap;
            constituent.weight = (constituent.grossMarketCapitalisation*100/totalCap).toFixed(2); 
        }

        //constituents.sort((a, b) => (a.grossMarketCapitalisation > b.grossMarketCapitalisation) ? -1 : 1);
        return constituents;
    }

    static async getConstituentData(indexCode, constituent, period){
        await constituent.getBetaData(indexCode)
        .then(function(betaModels) {
            var betaData = {}

            // Put the beta calculations with calculation date as key in the betadata array
            for (var j = 0; j < betaModels.length; j++) {
                var betaModel = betaModels[j];
                var date = betaModel['Date']
                if (!(date in betaData)){
                    betaData[date] = {}
                    betaData[date]['Date'] = date
                    betaData[date]['StartDate'] = betaModel['StartDate']
                }
                
                var index = betaModel['IndexCode']
                betaData[date][index+"_BT"] = parseFloat(betaModel['Beta']).toFixed(2)
                betaData[date][index+"_AL"] = parseFloat(betaModel['Alpha']).toFixed(4)
                betaData[date][index+"_UR"] = parseFloat(betaModel['UniqueRisk']).toFixed(2)
                betaData[date][index+"_TR"] = parseFloat(betaModel['TotalRisk']).toFixed(2)
            }
            constituent.Beta = betaData
        })
        .catch(function (err) {
            console.log("*** error getting beta: "+err);
        });
        
        await constituent.getEquityData(period)
        .then(function(equityData){
            constituent.EquityData = {}
            constituent.EquityData[constituent.date] = equityData;
        })
        .catch(function (err) {
            console.log("*** error getting equity data: "+err);
        });

        await constituent.getIndexEquityData(indexCode, period)
        .then(function(equityData){
            constituent.IndexEquityData = {}
            constituent.IndexEquityData[constituent.date] = equityData;
        })
        .catch(function (err) {
            console.log("*** error getting index equity data: "+err);
        });

        // Return 200 data points equally spaced in the date range
        // We do not want too much data being loaded
        constituent.trimEquityData(200)

        constituent.calculateEquityReturns();
        constituent.calculateIndexEquityReturns();
    }

    trimEquityData(number){
        var trimmedEquityData = []
        var trimmedIndexEquityData = []

        var equityData = this.EquityData[this.date]
        var indexEquityData = this.IndexEquityData[this.date]

        // If an index only started being recorded recently
        // The share data should match that otherwise we cant make reasonable comparisons
        if (equityData.length !== indexEquityData.length){
            var min = Math.min(equityData.length, indexEquityData.length)
            equityData = equityData.slice(0, min);
            indexEquityData = indexEquityData.slice(0, min);

            this.EquityData[this.date] = equityData
            this.IndexEquityData[this.date] = indexEquityData
        }

        var increment = Math.max(1,Math.trunc(equityData.length/number));
        var index = 0;
        while (index <= equityData.length - 1){
            trimmedEquityData.push(equityData[index])
            trimmedIndexEquityData.push(indexEquityData[index])
            index += increment
        }

        this.EquityData[this.date] = trimmedEquityData
        this.IndexEquityData[this.date] = trimmedIndexEquityData
    }

    async getBetaData(indexCode) {
        return await BetaModel.findAll({
            where: sequelize.literal(
                //" MONTH([Date]) = MONTH('"+this.date+"') AND"+
                //" YEAR([Date]) = YEAR('"+this.date+"') AND"+
                " Instrument = '"+this.alpha+"'"
                //" [Index] = '"+indexCode+"'"
            ),
            order: [ [ 'Date', 'DESC' ]]
        });
    }

    async getEquityData(period) {
        return await EquityDataModel.findAll({
            where: sequelize.literal(
                " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+this.date+"') AND '"+this.date+"') AND"+
                " Instrument = '"+this.alpha+"'"
                //" LOWER(DATENAME(dw, [Date]))='friday'"
            ),
            order: [ [ 'Date', 'DESC' ]]
        })
    }

    async getIndexEquityData(indexCode, period) {
        return await EquityDataModel.findAll({
            where: sequelize.literal(
                " (Date BETWEEN DATEADD(MONTH,"+(-1 * period)+",'"+this.date+"') AND '"+this.date+"') AND"+
                " Instrument = '"+indexCode+"'"
                //" LOWER(DATENAME(dw, [Date]))='friday'"
            ),
            order: [ [ 'Date', 'DESC' ]]
        })
    }

    calculateEquityReturns(){
        var equityData = this.EquityData[this.date]
        var priceZero = equityData[equityData.length - 1]["Price"];
        
        for (var i = 0; i < equityData.length; i++) {
            var returns  = ((equityData[i]["Price"] - priceZero)*100/priceZero).toFixed(2);
            equityData[i].Return = returns;
        }
    }

    calculateIndexEquityReturns(){
        var indexEquityData = this.IndexEquityData[this.date]
        var priceZero = indexEquityData[indexEquityData.length - 1]["Price"];
        for (var i = 0; i < indexEquityData.length; i++) {
            var returns  = ((indexEquityData[i]["Price"] - priceZero)*100/priceZero).toFixed(2);
            indexEquityData[i].Return = returns;
        }
    }
}

export default IndexConstituent;