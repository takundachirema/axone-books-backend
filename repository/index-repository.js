import {sequelize} from '../api/config/db';
var IndexConstituentModel = require('../model/index_constituent-model').default;
var IndexMetricModel = require('../model/industry-portf-model').default;
var IndexModel = require('../model/index-model').default;
var BetaModel = require('../model/beta-model').default;
var IndexConstituentRep = require('./index_constituent-repository').default;

class Index {
    constructor(code) {
        
        this.code = code;

        this.codeColumns = {
            "J203":"ALSI New","J204":"ALSI New",
            "J205":"Index New","J201":"Index New","J202":"Index New",
            "J200":"TOPI New","J210":"RESI New","J212":"FINI New","J211":"INDI New",
            "J254":"PCAP New","J253":"SAPY New","J232":"ALTI New"
        };

        this.alternateCodes = {
            "J203":"ALSI","J204":"FLED",
            "J205":"LRGC","J201":"MIDC","J202":"SMLC",
            "J200":"TOPI","J210":"RESI","J212":"FINI","J211":"INDI",
            "J254":"PCAP","J253":"SAPY","J232":"ALTI"
        };
    }

    set setDate(date){
        this.date = date;
    }

    /**
     * The method will get constituents data for the index
     * @param {*} date This is beta calculation date
     * @param {*} period This is period from beta calculation to show equity data
     */
    async getData(date, period) {
        var results = {"success":0};
        var code = this.code;
        var indexRep = this;
        var constituentModels;

        indexRep.date = date
        indexRep.period = period

        // Get all periods
        await IndexConstituentModel.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('Date')), 'Date']],
            order: [ [ 'Date', 'DESC' ]]
        })
        .then(function(dates){
            console.log("**** index rep dates "+dates.length);
            indexRep.dates = dates;
        })
        .catch(function (err) {
            results["message"] = err;
            console.log("*** dates error "+err)
            return results;
        });

        // Get all constituent models for specified period
        await IndexConstituentModel.findAll({
            where: sequelize.literal
            (
                " ["+this.codeColumns[this.code]+"] = '"+this.alternateCodes[this.code]+"' AND"+
                " Date = '"+date+"'"
            )
        })
        .then(function(constituents){
            console.log("**** index rep 1 "+constituents.length);
            constituentModels = constituents;
        })
        .catch(function (err) {
            results["message"] = err;
            return results;
        });

        // Gets the repository from the models and calculates the market values
        indexRep.constituents = IndexConstituentRep.getConstituents(constituentModels);
        
        // Gets the equity data of the consituent with biggest market share
        // Other constituents equity data can be obtained when user specifically selects on UI
        var key = Object.keys(indexRep.constituents)[0];
        await IndexConstituentRep.getConstituentData(code, indexRep.constituents[key], period);

        results["success"] = 1;

        return results;
    }

    async getConstituentAndData(constituentCode, period) {
        var results = {"success":0}
        var indexColumn = this.codeColumns[this.code]
        var indexAlternateCode = this.alternateCodes[this.code]
        var constituent;

        await IndexConstituentModel.findOne({
            where: sequelize.literal(
                " Date = '"+this.date+"' AND"+
                " ["+indexColumn+"] = '"+indexAlternateCode+"' AND"+
                " Alpha = '"+constituentCode+"'"
            )
        })
        .then(function(constituentModel) {
            constituent = new IndexConstituentRep(constituentModel["Date"],constituentModel["Alpha"]);
        }).catch(function (err) {
            console.log("** 1 con data "+error)
            results["message"] = err
            return results
        });

        await IndexConstituentRep.getConstituentData(this.code, constituent, period)

        results["success"] = 1
        results["message"] = "Success"
        results["data"] = constituent
        return results
    }

    static async getIndexBetaData(date){
        var results = {"success":0};
        results["data"] = {}
        var betaAttributes = ['StartDate','Date','IndexCode','Beta','DataPoints','DaysTraded']
        var betaDates;
        
        // Get all dates
        await BetaModel.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('Date')), 'Date']],
            order: [ [ 'Date', 'DESC' ]]
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

        await IndexModel.findAll({
            include: [
                {model: BetaModel, attributes: betaAttributes, required: true}
            ],
            where: sequelize.literal
            (
                " MONTH([Beta].[Date]) = MONTH('"+date+"') AND YEAR([Beta].[Date]) = YEAR('"+date+"')"
            )
        })
        .then(function(indexBetaModels){
            console.log("** beta data "+indexBetaModels.length);
            
            var indexBetas = Index.prepareIndexBetaData(indexBetaModels)

            results["success"] = 1
            results["message"] = "Successful"
            results["data"]["dates"] = betaDates
            results["data"]["betas"] = indexBetas
        }).catch(function (err) {
            console.log("*** error beta data: "+err);
            results["message"] = err
        });

        return results
    }

    /**
     * Each index will have an array of betas for the date that was passed
     * This methods gets those betas and makes one entry that has all the betas
     * @param {*} indexBetaModels 
     */
    static prepareIndexBetaData(indexBetaModels){

        var indexBetas = {}

        //console.log('** cbm: '+JSON.stringify(indexBetaModels[0]))
        for (var i = 0; i < indexBetaModels.length; i++) {
            var code = indexBetaModels[i]['IndexCode'];
            var name = indexBetaModels[i]['IndexName'];
            var type = indexBetaModels[i]['IndexType'];
            var betaModels = indexBetaModels[i]['Beta'];

            indexBetas[code] = {}
            indexBetas[code]['IndexCode'] = code
            indexBetas[code]['IndexName'] = name
            indexBetas[code]['IndexType'] = type

            for (var j = 0; j < betaModels.length; j++){
                var betaModel = betaModels[j];
                var index = betaModel['IndexCode']
                indexBetas[code][index] = parseFloat(betaModel['Beta']).toFixed(2)
            }

            indexBetas[code]['FirstTrade'] = betaModels[0]['StartDate']
            indexBetas[code]['LastTrade'] = betaModels[0]['Date']
            indexBetas[code]['DataPoints'] = betaModels[0]['DataPoints']
            indexBetas[code]['DaysTraded'] = parseFloat(betaModels[0]['DaysTraded']).toFixed(2)
        }

        return Object.values(indexBetas)
    }

    static async getIndexMetricData(metricType, indexCode, marketIndexCode) {
        var results = {"success":0};
        results["data"] = {}
        var getAttributes = ['Date','IndexCode','MarketIndex','Industry', metricType]
        
        await IndexMetricModel.findAll({
            attributes: getAttributes,
            where: {
                IndexCode: indexCode,
                MarketIndex: marketIndexCode
            }
        })
        .then(function(indexMetrics) {
            var metricData = {}

            // Put the metric data per quarter for selected metric
            for (var j = 0; j < indexMetrics.length; j++) {
                var indexMetric = indexMetrics[j];
                var date = indexMetric['Date']
                var industry = indexMetric['Industry']
                if (!(date in metricData)){
                    metricData[date] = {}
                    metricData[date]['Date'] = date
                }
                
                metricData[date][industry] = parseFloat(indexMetric[''+metricType]).toFixed(4)
            }

            results["success"] = 1
            results["message"] = "Successful"
            results["data"] = metricData
        })
        .catch(function (err) {
            results["message"] = err;
            console.log("*** metrics error "+err)
        });

        return results
    }
}

export default Index;