'use strict';

var coinsph$1 = require('./abstract/coinsph.js');
var errors = require('./base/errors.js');
var number = require('./base/functions/number.js');
var Precise = require('./base/Precise.js');
var sha256 = require('./static_dependencies/noble-hashes/sha256.js');

// ----------------------------------------------------------------------------
/**
 * @class coinsph
 * @augments Exchange
 */
class coinsph extends coinsph$1 {
    describe() {
        return this.deepExtend(super.describe(), {
            'id': 'coinsph',
            'name': 'Coins.ph',
            'countries': ['PH'],
            'version': 'v1',
            'rateLimit': 50,
            'certified': false,
            'pro': false,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'borrowMargin': false,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createDepositAddress': false,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createOrderWithTakeProfitAndStopLossWs': false,
                'createPostOnlyOrder': false,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'deposit': true,
                'editOrder': false,
                'fetchAccounts': false,
                'fetchBalance': true,
                'fetchBidsAsks': false,
                'fetchBorrowInterest': false,
                'fetchBorrowRate': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchBorrowRates': false,
                'fetchBorrowRatesPerSymbol': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrder': false,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': undefined,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchDepositWithdrawFee': false,
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': false,
                'fetchFundingInterval': false,
                'fetchFundingIntervals': false,
                'fetchFundingRate': false,
                'fetchFundingRateHistory': false,
                'fetchFundingRates': false,
                'fetchGreeks': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchIsolatedPositions': false,
                'fetchL3OrderBook': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverages': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': false,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarginMode': false,
                'fetchMarginModes': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMarkPrices': false,
                'fetchMyLiquidations': false,
                'fetchMySettlementHistory': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': false,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': true,
                'fetchOption': false,
                'fetchOptionChain': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': false,
                'fetchOrderTrades': true,
                'fetchPosition': false,
                'fetchPositionHistory': false,
                'fetchPositionMode': false,
                'fetchPositions': false,
                'fetchPositionsForSymbol': false,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchSettlementHistory': false,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTradingLimits': false,
                'fetchTransactionFee': false,
                'fetchTransactionFees': false,
                'fetchTransactions': false,
                'fetchTransfers': false,
                'fetchVolatilityHistory': false,
                'fetchWithdrawal': undefined,
                'fetchWithdrawals': true,
                'fetchWithdrawalWhitelist': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'repayMargin': false,
                'setLeverage': false,
                'setMargin': false,
                'setMarginMode': false,
                'setPositionMode': false,
                'signIn': false,
                'transfer': false,
                'withdraw': true,
                'ws': false,
            },
            'timeframes': {
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/225719995-48ab2026-4ddb-496c-9da7-0d7566617c9b.jpg',
                'api': {
                    'public': 'https://api.pro.coins.ph',
                    'private': 'https://api.pro.coins.ph',
                },
                'www': 'https://coins.ph/',
                'doc': [
                    'https://coins-docs.github.io/rest-api',
                ],
                'fees': 'https://support.coins.ph/hc/en-us/sections/4407198694681-Limits-Fees',
            },
            'api': {
                'public': {
                    'get': {
                        'openapi/v1/ping': 1,
                        'openapi/v1/time': 1,
                        // cost 1 if 'symbol' param defined (one market symbol) or if 'symbols' param is a list of 1-20 market symbols
                        // cost 20 if 'symbols' param is a list of 21-100 market symbols
                        // cost 40 if 'symbols' param is a list of 101 or more market symbols or if both 'symbol' and 'symbols' params are omited
                        'openapi/quote/v1/ticker/24hr': { 'cost': 1, 'noSymbolAndNoSymbols': 40, 'byNumberOfSymbols': [[101, 40], [21, 20], [0, 1]] },
                        // cost 1 if 'symbol' param defined (one market symbol)
                        // cost 2 if 'symbols' param is a list of 1 or more market symbols or if both 'symbol' and 'symbols' params are omited
                        'openapi/quote/v1/ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        // cost 1 if 'symbol' param defined (one market symbol)
                        // cost 2 if 'symbols' param is a list of 1 or more market symbols or if both 'symbol' and 'symbols' params are omited
                        'openapi/quote/v1/ticker/bookTicker': { 'cost': 1, 'noSymbol': 2 },
                        'openapi/v1/exchangeInfo': 10,
                        // cost 1 if limit <= 100; 5 if limit > 100.
                        'openapi/quote/v1/depth': { 'cost': 1, 'byLimit': [[101, 5], [0, 1]] },
                        'openapi/quote/v1/klines': 1,
                        'openapi/quote/v1/trades': 1,
                        'openapi/v1/pairs': 1,
                        'openapi/quote/v1/avgPrice': 1,
                    },
                },
                'private': {
                    'get': {
                        'openapi/wallet/v1/config/getall': 10,
                        'openapi/wallet/v1/deposit/address': 10,
                        'openapi/wallet/v1/deposit/history': 1,
                        'openapi/wallet/v1/withdraw/history': 1,
                        'openapi/v1/account': 10,
                        // cost 3 for a single symbol; 40 when the symbol parameter is omitted
                        'openapi/v1/openOrders': { 'cost': 3, 'noSymbol': 40 },
                        'openapi/v1/asset/tradeFee': 1,
                        'openapi/v1/order': 2,
                        // cost 10 with symbol, 40 when the symbol parameter is omitted;
                        'openapi/v1/historyOrders': { 'cost': 10, 'noSymbol': 40 },
                        'openapi/v1/myTrades': 10,
                        'openapi/v1/capital/deposit/history': 1,
                        'openapi/v1/capital/withdraw/history': 1,
                        'openapi/v3/payment-request/get-payment-request': 1,
                        'merchant-api/v1/get-invoices': 1,
                        'openapi/account/v3/crypto-accounts': 1,
                        'openapi/transfer/v3/transfers/{id}': 1,
                    },
                    'post': {
                        'openapi/wallet/v1/withdraw/apply': 600,
                        'openapi/v1/order/test': 1,
                        'openapi/v1/order': 1,
                        'openapi/v1/capital/withdraw/apply': 1,
                        'openapi/v1/capital/deposit/apply': 1,
                        'openapi/v3/payment-request/payment-requests': 1,
                        'openapi/v3/payment-request/delete-payment-request': 1,
                        'openapi/v3/payment-request/payment-request-reminder': 1,
                        'openapi/v1/userDataStream': 1,
                        'merchant-api/v1/invoices': 1,
                        'merchant-api/v1/invoices-cancel': 1,
                        'openapi/convert/v1/get-supported-trading-pairs': 1,
                        'openapi/convert/v1/get-quote': 1,
                        'openapi/convert/v1/accpet-quote': 1,
                        'openapi/fiat/v1/support-channel': 1,
                        'openapi/fiat/v1/cash-out': 1,
                        'openapi/fiat/v1/history': 1,
                        'openapi/migration/v4/sellorder': 1,
                        'openapi/migration/v4/validate-field': 1,
                        'openapi/transfer/v3/transfers': 1,
                    },
                    'delete': {
                        'openapi/v1/order': 1,
                        'openapi/v1/openOrders': 1,
                        'openapi/v1/userDataStream': 1,
                    },
                },
            },
            'fees': {
                // todo: zero fees for USDT, ETH and BTC markets till 2023-04-02
                'trading': {
                    'feeSide': 'get',
                    'tierBased': true,
                    'percentage': true,
                    'maker': this.parseNumber('0.0025'),
                    'taker': this.parseNumber('0.003'),
                    'tiers': {
                        'taker': [
                            [this.parseNumber('0'), this.parseNumber('0.003')],
                            [this.parseNumber('500000'), this.parseNumber('0.0027')],
                            [this.parseNumber('1000000'), this.parseNumber('0.0024')],
                            [this.parseNumber('2500000'), this.parseNumber('0.002')],
                            [this.parseNumber('5000000'), this.parseNumber('0.0018')],
                            [this.parseNumber('10000000'), this.parseNumber('0.0015')],
                            [this.parseNumber('100000000'), this.parseNumber('0.0012')],
                            [this.parseNumber('500000000'), this.parseNumber('0.0009')],
                            [this.parseNumber('1000000000'), this.parseNumber('0.0007')],
                            [this.parseNumber('2500000000'), this.parseNumber('0.0005')],
                        ],
                        'maker': [
                            [this.parseNumber('0'), this.parseNumber('0.0025')],
                            [this.parseNumber('500000'), this.parseNumber('0.0022')],
                            [this.parseNumber('1000000'), this.parseNumber('0.0018')],
                            [this.parseNumber('2500000'), this.parseNumber('0.0015')],
                            [this.parseNumber('5000000'), this.parseNumber('0.0012')],
                            [this.parseNumber('10000000'), this.parseNumber('0.001')],
                            [this.parseNumber('100000000'), this.parseNumber('0.0008')],
                            [this.parseNumber('500000000'), this.parseNumber('0.0007')],
                            [this.parseNumber('1000000000'), this.parseNumber('0.0006')],
                            [this.parseNumber('2500000000'), this.parseNumber('0.0005')],
                        ],
                    },
                },
            },
            'precisionMode': number.TICK_SIZE,
            // exchange-specific options
            'options': {
                'createMarketBuyOrderRequiresPrice': true,
                'withdraw': {
                    'warning': false,
                },
                'deposit': {
                    'warning': false,
                },
                'createOrder': {
                    'timeInForce': 'GTC',
                    'newOrderRespType': {
                        'market': 'FULL',
                        'limit': 'FULL', // we change it from 'ACK' by default to 'FULL'
                    },
                },
                'fetchTicker': {
                    'method': 'publicGetOpenapiQuoteV1Ticker24hr', // publicGetOpenapiQuoteV1TickerPrice, publicGetOpenapiQuoteV1TickerBookTicker
                },
                'fetchTickers': {
                    'method': 'publicGetOpenapiQuoteV1Ticker24hr', // publicGetOpenapiQuoteV1TickerPrice, publicGetOpenapiQuoteV1TickerBookTicker
                },
                'networks': {
                    // all networks: 'ETH', 'TRX', 'BSC', 'ARBITRUM', 'RON', 'BTC', 'XRP'
                    // you can call api privateGetOpenapiWalletV1ConfigGetall to check which network is supported for the currency
                    'TRC20': 'TRX',
                    'ERC20': 'ETH',
                    'BEP20': 'BSC',
                    'ARB': 'ARBITRUM',
                },
            },
            'features': {
                'spot': {
                    'sandbox': false,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false,
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': false,
                            'GTD': false,
                        },
                        'hedged': false,
                        'trailing': false,
                        'leverage': false,
                        'marketBuyByCost': true,
                        'marketBuyRequiresPrice': false,
                        'selfTradePrevention': true,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 1000,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'symbolRequired': true,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': undefined,
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'limit': 1000,
                        'daysBack': 100000,
                        'daysBackCanceled': 1,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': true,
                    },
                    'fetchOHLCV': {
                        'limit': 1000,
                    },
                },
                'swap': {
                    'linear': undefined,
                    'inverse': undefined,
                },
                'future': {
                    'linear': undefined,
                    'inverse': undefined,
                },
            },
            // https://coins-docs.github.io/errors/
            'exceptions': {
                'exact': {
                    '-1000': errors.BadRequest,
                    '-1001': errors.BadRequest,
                    '-1002': errors.AuthenticationError,
                    '-1003': errors.RateLimitExceeded,
                    '-1004': errors.InvalidOrder,
                    '-1006': errors.BadResponse,
                    '-1007': errors.BadResponse,
                    '-1014': errors.InvalidOrder,
                    '-1015': errors.RateLimitExceeded,
                    '-1016': errors.NotSupported,
                    '-1020': errors.NotSupported,
                    '-1021': errors.BadRequest,
                    '-1022': errors.BadRequest,
                    '-1023': errors.AuthenticationError,
                    '-1024': errors.BadRequest,
                    '-1025': errors.BadRequest,
                    '-1030': errors.ExchangeError,
                    '-1100': errors.BadRequest,
                    '-1101': errors.BadRequest,
                    '-1102': errors.BadRequest,
                    '-1103': errors.BadRequest,
                    '-1104': errors.BadRequest,
                    '-1105': errors.BadRequest,
                    '-1106': errors.BadRequest,
                    '-1111': errors.BadRequest,
                    '-1112': errors.BadResponse,
                    '-1114': errors.BadRequest,
                    '-1115': errors.InvalidOrder,
                    '-1116': errors.InvalidOrder,
                    '-1117': errors.InvalidOrder,
                    '-1118': errors.InvalidOrder,
                    '-1119': errors.InvalidOrder,
                    '-1120': errors.BadRequest,
                    '-1121': errors.BadSymbol,
                    '-1122': errors.InvalidOrder,
                    '-1125': errors.BadRequest,
                    '-1127': errors.BadRequest,
                    '-1128': errors.BadRequest,
                    '-1130': errors.BadRequest,
                    '-1131': errors.InsufficientFunds,
                    '-1132': errors.InvalidOrder,
                    '-1133': errors.InvalidOrder,
                    '-1134': errors.InvalidOrder,
                    '-1135': errors.InvalidOrder,
                    '-1136': errors.InvalidOrder,
                    '-1137': errors.InvalidOrder,
                    '-1138': errors.InvalidOrder,
                    '-1139': errors.InvalidOrder,
                    '-1140': errors.InvalidOrder,
                    '-1141': errors.DuplicateOrderId,
                    '-1142': errors.InvalidOrder,
                    '-1143': errors.OrderNotFound,
                    '-1144': errors.InvalidOrder,
                    '-1145': errors.InvalidOrder,
                    '-1146': errors.InvalidOrder,
                    '-1147': errors.InvalidOrder,
                    '-1148': errors.InvalidOrder,
                    '-1149': errors.InvalidOrder,
                    '-1150': errors.InvalidOrder,
                    '-1151': errors.BadSymbol,
                    '-1152': errors.NotSupported,
                    '-1153': errors.AuthenticationError,
                    '-1154': errors.BadRequest,
                    '-1155': errors.BadRequest,
                    '-1156': errors.InvalidOrder,
                    '-1157': errors.BadSymbol,
                    '-1158': errors.InvalidOrder,
                    '-1159': errors.InvalidOrder,
                    '-1160': errors.BadRequest,
                    '-1161': errors.BadRequest,
                    '-2010': errors.InvalidOrder,
                    '-2013': errors.OrderNotFound,
                    '-2011': errors.BadRequest,
                    '-2014': errors.BadRequest,
                    '-2015': errors.AuthenticationError,
                    '-2016': errors.BadResponse,
                    '-3126': errors.InvalidOrder,
                    '-3127': errors.InvalidOrder,
                    '-4001': errors.BadRequest,
                    '-100011': errors.BadSymbol,
                    '-100012': errors.BadSymbol,
                    '-30008': errors.InsufficientFunds,
                    '-30036': errors.InsufficientFunds,
                    '403': errors.ExchangeNotAvailable,
                },
                'broad': {
                    'Unknown order sent': errors.OrderNotFound,
                    'Duplicate order sent': errors.DuplicateOrderId,
                    'Market is closed': errors.BadSymbol,
                    'Account has insufficient balance for requested action': errors.InsufficientFunds,
                    'Market orders are not supported for this symbol': errors.BadSymbol,
                    'Iceberg orders are not supported for this symbol': errors.BadSymbol,
                    'Stop loss orders are not supported for this symbol': errors.BadSymbol,
                    'Stop loss limit orders are not supported for this symbol': errors.BadSymbol,
                    'Take profit orders are not supported for this symbol': errors.BadSymbol,
                    'Take profit limit orders are not supported for this symbol': errors.BadSymbol,
                    'Price* QTY is zero or less': errors.BadRequest,
                    'IcebergQty exceeds QTY': errors.BadRequest,
                    'This action disabled is on this account': errors.PermissionDenied,
                    'Unsupported order combination': errors.InvalidOrder,
                    'Order would trigger immediately': errors.InvalidOrder,
                    'Cancel order is invalid. Check origClOrdId and orderId': errors.InvalidOrder,
                    'Order would immediately match and take': errors.OrderImmediatelyFillable,
                    'PRICE_FILTER': errors.InvalidOrder,
                    'LOT_SIZE': errors.InvalidOrder,
                    'MIN_NOTIONAL': errors.InvalidOrder,
                    'MAX_NUM_ORDERS': errors.InvalidOrder,
                    'MAX_ALGO_ORDERS': errors.InvalidOrder,
                    'BROKER_MAX_NUM_ORDERS': errors.InvalidOrder,
                    'BROKER_MAX_ALGO_ORDERS': errors.InvalidOrder,
                    'ICEBERG_PARTS': errors.BadRequest, // Iceberg order would break into too many parts; icebergQty is too small.
                },
            },
        });
    }
    /**
     * @method
     * @name coinsph#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://docs.coins.ph/rest-api/#all-coins-information-user_data
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies(params = {}) {
        if (!this.checkRequiredCredentials(false)) {
            return undefined;
        }
        const response = await this.privateGetOpenapiWalletV1ConfigGetall(params);
        //
        //    [
        //        {
        //            "coin": "PHP",
        //            "name": "PHP",
        //            "depositAllEnable": false,
        //            "withdrawAllEnable": false,
        //            "free": "0",
        //            "locked": "0",
        //            "transferPrecision": "2",
        //            "transferMinQuantity": "0",
        //            "networkList": [],
        //            "legalMoney": true
        //        },
        //        {
        //            "coin": "USDT",
        //            "name": "USDT",
        //            "depositAllEnable": true,
        //            "withdrawAllEnable": true,
        //            "free": "0",
        //            "locked": "0",
        //            "transferPrecision": "8",
        //            "transferMinQuantity": "0",
        //            "networkList": [
        //                {
        //                    "addressRegex": "^0x[0-9a-fA-F]{40}$",
        //                    "memoRegex": " ",
        //                    "network": "ETH",
        //                    "name": "Ethereum (ERC20)",
        //                    "depositEnable": true,
        //                    "minConfirm": "12",
        //                    "unLockConfirm": "-1",
        //                    "withdrawDesc": "",
        //                    "withdrawEnable": true,
        //                    "withdrawFee": "6",
        //                    "withdrawIntegerMultiple": "0.000001",
        //                    "withdrawMax": "500000",
        //                    "withdrawMin": "10",
        //                    "sameAddress": false
        //                },
        //                {
        //                    "addressRegex": "^T[0-9a-zA-Z]{33}$",
        //                    "memoRegex": "",
        //                    "network": "TRX",
        //                    "name": "TRON",
        //                    "depositEnable": true,
        //                    "minConfirm": "19",
        //                    "unLockConfirm": "-1",
        //                    "withdrawDesc": "",
        //                    "withdrawEnable": true,
        //                    "withdrawFee": "3",
        //                    "withdrawIntegerMultiple": "0.000001",
        //                    "withdrawMax": "1000000",
        //                    "withdrawMin": "20",
        //                    "sameAddress": false
        //                }
        //            ],
        //            "legalMoney": false
        //        }
        //    ]
        //
        const result = {};
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const id = this.safeString(entry, 'coin');
            const code = this.safeCurrencyCode(id);
            const isFiat = this.safeBool(entry, 'isLegalMoney');
            const networkList = this.safeList(entry, 'networkList', []);
            const networks = {};
            for (let j = 0; j < networkList.length; j++) {
                const networkItem = networkList[j];
                const network = this.safeString(networkItem, 'network');
                const networkCode = this.networkIdToCode(network);
                networks[networkCode] = {
                    'info': networkItem,
                    'id': network,
                    'network': networkCode,
                    'active': undefined,
                    'deposit': this.safeBool(networkItem, 'depositEnable'),
                    'withdraw': this.safeBool(networkItem, 'withdrawEnable'),
                    'fee': this.safeNumber(networkItem, 'withdrawFee'),
                    'precision': this.safeNumber(networkItem, 'withdrawIntegerMultiple'),
                    'limits': {
                        'withdraw': {
                            'min': this.safeNumber(networkItem, 'withdrawMin'),
                            'max': this.safeNumber(networkItem, 'withdrawMax'),
                        },
                        'deposit': {
                            'min': undefined,
                            'max': undefined,
                        },
                    },
                };
            }
            result[code] = this.safeCurrencyStructure({
                'id': id,
                'name': this.safeString(entry, 'name'),
                'code': code,
                'type': isFiat ? 'fiat' : 'crypto',
                'precision': this.parseNumber(this.parsePrecision(this.safeString(entry, 'transferPrecision'))),
                'info': entry,
                'active': undefined,
                'deposit': this.safeBool(entry, 'depositAllEnable'),
                'withdraw': this.safeBool(entry, 'withdrawAllEnable'),
                'networks': networks,
                'fee': undefined,
                'fees': undefined,
                'limits': {},
            });
        }
        return result;
    }
    calculateRateLimiterCost(api, method, path, params, config = {}) {
        if (('noSymbol' in config) && !('symbol' in params)) {
            return config['noSymbol'];
        }
        else if (('noSymbolAndNoSymbols' in config) && !('symbol' in params) && !('symbols' in params)) {
            return config['noSymbolAndNoSymbols'];
        }
        else if (('byNumberOfSymbols' in config) && ('symbols' in params)) {
            const symbols = params['symbols'];
            const symbolsAmount = symbols.length;
            const byNumberOfSymbols = config['byNumberOfSymbols'];
            for (let i = 0; i < byNumberOfSymbols.length; i++) {
                const entry = byNumberOfSymbols[i];
                if (symbolsAmount >= entry[0]) {
                    return entry[1];
                }
            }
        }
        else if (('byLimit' in config) && ('limit' in params)) {
            const limit = params['limit'];
            const byLimit = config['byLimit'];
            for (let i = 0; i < byLimit.length; i++) {
                const entry = byLimit[i];
                if (limit >= entry[0]) {
                    return entry[1];
                }
            }
        }
        return this.safeValue(config, 'cost', 1);
    }
    /**
     * @method
     * @name coinsph#fetchStatus
     * @description the latest known information on the availability of the exchange API
     * @see https://coins-docs.github.io/rest-api/#test-connectivity
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [status structure]{@link https://docs.ccxt.com/#/?id=exchange-status-structure}
     */
    async fetchStatus(params = {}) {
        const response = await this.publicGetOpenapiV1Ping(params);
        return {
            'status': 'ok',
            'updated': undefined,
            'eta': undefined,
            'url': undefined,
            'info': response,
        };
    }
    /**
     * @method
     * @name coinsph#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @see https://coins-docs.github.io/rest-api/#check-server-time
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime(params = {}) {
        const response = await this.publicGetOpenapiV1Time(params);
        //
        //     {"serverTime":1677705408268}
        //
        return this.safeInteger(response, 'serverTime');
    }
    /**
     * @method
     * @name coinsph#fetchMarkets
     * @description retrieves data on all markets for coinsph
     * @see https://coins-docs.github.io/rest-api/#exchange-information
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets(params = {}) {
        const response = await this.publicGetOpenapiV1ExchangeInfo(params);
        //
        //     {
        //         "timezone": "UTC",
        //         "serverTime": "1677449496897",
        //         "exchangeFilters": [],
        //         "symbols": [
        //             {
        //                 "symbol": "XRPPHP",
        //                 "status": "TRADING",
        //                 "baseAsset": "XRP",
        //                 "baseAssetPrecision": "2",
        //                 "quoteAsset": "PHP",
        //                 "quoteAssetPrecision": "4",
        //                 "orderTypes": [
        //                     "LIMIT",
        //                     "MARKET",
        //                     "LIMIT_MAKER",
        //                     "STOP_LOSS_LIMIT",
        //                     "STOP_LOSS",
        //                     "TAKE_PROFIT_LIMIT",
        //                     "TAKE_PROFIT"
        //                 ],
        //                 "filters": [
        //                     {
        //                         "minPrice": "0.01",
        //                         "maxPrice": "99999999.00000000",
        //                         "tickSize": "0.01",
        //                         "filterType": "PRICE_FILTER"
        //                     },
        //                     {
        //                         "minQty": "0.01",
        //                         "maxQty": "99999999999.00000000",
        //                         "stepSize": "0.01",
        //                         "filterType": "LOT_SIZE"
        //                     },
        //                     { minNotional: "50", filterType: "NOTIONAL" },
        //                     { minNotional: "50", filterType: "MIN_NOTIONAL" },
        //                     {
        //                         "priceUp": "99999999",
        //                         "priceDown": "0.01",
        //                         "filterType": "STATIC_PRICE_RANGE"
        //                     },
        //                     {
        //                         "multiplierUp": "1.1",
        //                         "multiplierDown": "0.9",
        //                         "filterType": "PERCENT_PRICE_INDEX"
        //                     },
        //                     {
        //                         "multiplierUp": "1.1",
        //                         "multiplierDown": "0.9",
        //                         "filterType": "PERCENT_PRICE_ORDER_SIZE"
        //                     },
        //                     { maxNumOrders: "200", filterType: "MAX_NUM_ORDERS" },
        //                     { maxNumAlgoOrders: "5", filterType: "MAX_NUM_ALGO_ORDERS" }
        //                 ]
        //             },
        //         ]
        //     }
        //
        const markets = this.safeList(response, 'symbols', []);
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const id = this.safeString(market, 'symbol');
            const baseId = this.safeString(market, 'baseAsset');
            const quoteId = this.safeString(market, 'quoteAsset');
            const base = this.safeCurrencyCode(baseId);
            const quote = this.safeCurrencyCode(quoteId);
            const limits = this.indexBy(this.safeList(market, 'filters', []), 'filterType');
            const amountLimits = this.safeValue(limits, 'LOT_SIZE', {});
            const priceLimits = this.safeValue(limits, 'PRICE_FILTER', {});
            const costLimits = this.safeValue(limits, 'NOTIONAL', {});
            result.push({
                'id': id,
                'symbol': base + '/' + quote,
                'base': base,
                'quote': quote,
                'settle': undefined,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': undefined,
                'type': 'spot',
                'spot': true,
                'margin': false,
                'swap': false,
                'future': false,
                'option': false,
                'active': this.safeStringLower(market, 'status') === 'trading',
                'contract': false,
                'linear': undefined,
                'inverse': undefined,
                'taker': undefined,
                'maker': undefined,
                'contractSize': undefined,
                'expiry': undefined,
                'expiryDatetime': undefined,
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': this.parseNumber(this.safeString(amountLimits, 'stepSize')),
                    'price': this.parseNumber(this.safeString(priceLimits, 'tickSize')),
                },
                'limits': {
                    'leverage': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'amount': {
                        'min': this.parseNumber(this.safeString(amountLimits, 'minQty')),
                        'max': this.parseNumber(this.safeString(amountLimits, 'maxQty')),
                    },
                    'price': {
                        'min': this.parseNumber(this.safeString(priceLimits, 'minPrice')),
                        'max': this.parseNumber(this.safeString(priceLimits, 'maxPrice')),
                    },
                    'cost': {
                        'min': this.parseNumber(this.safeString(costLimits, 'minNotional')),
                        'max': undefined,
                    },
                },
                'created': undefined,
                'info': market,
            });
        }
        this.setMarkets(result);
        return result;
    }
    /**
     * @method
     * @name coinsph#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://coins-docs.github.io/rest-api/#24hr-ticker-price-change-statistics
     * @see https://coins-docs.github.io/rest-api/#symbol-price-ticker
     * @see https://coins-docs.github.io/rest-api/#symbol-order-book-ticker
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers(symbols = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        if (symbols !== undefined) {
            const ids = [];
            for (let i = 0; i < symbols.length; i++) {
                const market = this.market(symbols[i]);
                const id = market['id'];
                ids.push(id);
            }
            request['symbols'] = ids;
        }
        const defaultMethod = 'publicGetOpenapiQuoteV1Ticker24hr';
        const options = this.safeDict(this.options, 'fetchTickers', {});
        const method = this.safeString(options, 'method', defaultMethod);
        let tickers = undefined;
        if (method === 'publicGetOpenapiQuoteV1TickerPrice') {
            tickers = await this.publicGetOpenapiQuoteV1TickerPrice(this.extend(request, params));
        }
        else if (method === 'publicGetOpenapiQuoteV1TickerBookTicker') {
            tickers = await this.publicGetOpenapiQuoteV1TickerBookTicker(this.extend(request, params));
        }
        else {
            tickers = await this.publicGetOpenapiQuoteV1Ticker24hr(this.extend(request, params));
        }
        return this.parseTickers(tickers, symbols, params);
    }
    /**
     * @method
     * @name coinsph#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://coins-docs.github.io/rest-api/#24hr-ticker-price-change-statistics
     * @see https://coins-docs.github.io/rest-api/#symbol-price-ticker
     * @see https://coins-docs.github.io/rest-api/#symbol-order-book-ticker
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const defaultMethod = 'publicGetOpenapiQuoteV1Ticker24hr';
        const options = this.safeDict(this.options, 'fetchTicker', {});
        const method = this.safeString(options, 'method', defaultMethod);
        let ticker = undefined;
        if (method === 'publicGetOpenapiQuoteV1TickerPrice') {
            ticker = await this.publicGetOpenapiQuoteV1TickerPrice(this.extend(request, params));
        }
        else if (method === 'publicGetOpenapiQuoteV1TickerBookTicker') {
            ticker = await this.publicGetOpenapiQuoteV1TickerBookTicker(this.extend(request, params));
        }
        else {
            ticker = await this.publicGetOpenapiQuoteV1Ticker24hr(this.extend(request, params));
        }
        return this.parseTicker(ticker, market);
    }
    parseTicker(ticker, market = undefined) {
        //
        // publicGetOpenapiQuoteV1Ticker24hr
        //     {
        //         "symbol": "ETHUSDT",
        //         "priceChange": "41.440000000000000000",
        //         "priceChangePercent": "0.0259",
        //         "weightedAvgPrice": "1631.169825783972125436",
        //         "prevClosePrice": "1601.520000000000000000",
        //         "lastPrice": "1642.96",
        //         "lastQty": "0.000001000000000000",
        //         "bidPrice": "1638.790000000000000000",
        //         "bidQty": "0.280075000000000000",
        //         "askPrice": "1647.340000000000000000",
        //         "askQty": "0.165183000000000000",
        //         "openPrice": "1601.52",
        //         "highPrice": "1648.28",
        //         "lowPrice": "1601.52",
        //         "volume": "0.000287",
        //         "quoteVolume": "0.46814574",
        //         "openTime": "1677417000000",
        //         "closeTime": "1677503415200",
        //         "firstId": "1364680572697591809",
        //         "lastId": "1365389809203560449",
        //         "count": "100"
        //     }
        //
        // publicGetOpenapiQuoteV1TickerPrice
        //     { "symbol": "ETHUSDT", "price": "1599.68" }
        //
        // publicGetOpenapiQuoteV1TickerBookTicker
        //     {
        //         "symbol": "ETHUSDT",
        //         "bidPrice": "1596.57",
        //         "bidQty": "0.246405",
        //         "askPrice": "1605.12",
        //         "askQty": "0.242681"
        //     }
        //
        const marketId = this.safeString(ticker, 'symbol');
        market = this.safeMarket(marketId, market);
        const timestamp = this.safeInteger(ticker, 'closeTime');
        const bid = this.safeString(ticker, 'bidPrice');
        const ask = this.safeString(ticker, 'askPrice');
        const bidVolume = this.safeString(ticker, 'bidQty');
        const askVolume = this.safeString(ticker, 'askQty');
        const baseVolume = this.safeString(ticker, 'volume');
        const quoteVolume = this.safeString(ticker, 'quoteVolume');
        const open = this.safeString(ticker, 'openPrice');
        const high = this.safeString(ticker, 'highPrice');
        const low = this.safeString(ticker, 'lowPrice');
        const prevClose = this.safeString(ticker, 'prevClosePrice');
        const vwap = this.safeString(ticker, 'weightedAvgPrice');
        const changeValue = this.safeString(ticker, 'priceChange');
        let changePcnt = this.safeString(ticker, 'priceChangePercent');
        changePcnt = Precise["default"].stringMul(changePcnt, '100');
        return this.safeTicker({
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'open': open,
            'high': high,
            'low': low,
            'close': this.safeString2(ticker, 'lastPrice', 'price'),
            'bid': bid,
            'bidVolume': bidVolume,
            'ask': ask,
            'askVolume': askVolume,
            'vwap': vwap,
            'previousClose': prevClose,
            'change': changeValue,
            'percentage': changePcnt,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }
    /**
     * @method
     * @name coinsph#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://coins-docs.github.io/rest-api/#order-book
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return (default 100, max 200)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook(symbol, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicGetOpenapiQuoteV1Depth(this.extend(request, params));
        //
        //     {
        //         "lastUpdateId": "1667022157000699400",
        //         "bids": [
        //             [ '1651.810000000000000000', '0.214556000000000000' ],
        //             [ '1651.730000000000000000', '0.257343000000000000' ],
        //         ],
        //         "asks": [
        //             [ '1660.510000000000000000', '0.299092000000000000' ],
        //             [ '1660.600000000000000000', '0.253667000000000000' ],
        //         ]
        //     }
        //
        const orderbook = this.parseOrderBook(response, symbol);
        orderbook['nonce'] = this.safeInteger(response, 'lastUpdateId');
        return orderbook;
    }
    /**
     * @method
     * @name coinsph#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://coins-docs.github.io/rest-api/#klinecandlestick-data
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch (default 500, max 1000)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest candle to fetch
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV(symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const interval = this.safeString(this.timeframes, timeframe);
        const until = this.safeInteger(params, 'until');
        const request = {
            'symbol': market['id'],
            'interval': interval,
        };
        if (limit === undefined) {
            limit = 1000;
        }
        if (since !== undefined) {
            request['startTime'] = since;
            // since work properly only when it is "younger" than last "limit" candle
            if (until !== undefined) {
                request['endTime'] = until;
            }
            else {
                const duration = this.parseTimeframe(timeframe) * 1000;
                const endTimeByLimit = this.sum(since, duration * (limit - 1));
                const now = this.milliseconds();
                request['endTime'] = Math.min(endTimeByLimit, now);
            }
        }
        else if (until !== undefined) {
            request['endTime'] = until;
            // since work properly only when it is "younger" than last "limit" candle
            const duration = this.parseTimeframe(timeframe) * 1000;
            request['startTime'] = until - (duration * (limit - 1));
        }
        request['limit'] = limit;
        params = this.omit(params, 'until');
        const response = await this.publicGetOpenapiQuoteV1Klines(this.extend(request, params));
        //
        //     [
        //         [
        //             1499040000000,      // Open time
        //             "0.01634790",       // Open
        //             "0.80000000",       // High
        //             "0.01575800",       // Low
        //             "0.01577100",       // Close
        //             "148976.11427815",  // Volume
        //             1499644799999,      // Close time
        //             "2434.19055334",    // Quote asset volume
        //             308,                // Number of trades
        //             "1756.87402397",    // Taker buy base asset volume
        //             "28.46694368"       // Taker buy quote asset volume
        //         ]
        //     ]
        //
        return this.parseOHLCVs(response, market, timeframe, since, limit);
    }
    parseOHLCV(ohlcv, market = undefined) {
        return [
            this.safeInteger(ohlcv, 0),
            this.safeNumber(ohlcv, 1),
            this.safeNumber(ohlcv, 2),
            this.safeNumber(ohlcv, 3),
            this.safeNumber(ohlcv, 4),
            this.safeNumber(ohlcv, 5),
        ];
    }
    /**
     * @method
     * @name coinsph#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * @see https://coins-docs.github.io/rest-api/#recent-trades-list
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch (default 500, max 1000)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades(symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            // since work properly only when it is "younger" than last 'limit' trade
            request['limit'] = 1000;
        }
        else {
            if (limit !== undefined) {
                request['limit'] = limit;
            }
        }
        const response = await this.publicGetOpenapiQuoteV1Trades(this.extend(request, params));
        //
        //     [
        //         {
        //             "price": "89685.8",
        //             "id": "1365561108437680129",
        //             "qty": "0.000004",
        //             "quoteQty": "0.000004000000000000",
        //             "time": "1677523569575",
        //             "isBuyerMaker": false,
        //             "isBestMatch": true
        //         },
        //     ]
        //
        return this.parseTrades(response, market, since, limit);
    }
    /**
     * @method
     * @name coinsph#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://coins-docs.github.io/rest-api/#account-trade-list-user_data
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve (default 500, max 1000)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchMyTrades() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
            // since work properly only when it is "younger" than last 'limit' trade
            request['limit'] = 1000;
        }
        else if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOpenapiV1MyTrades(this.extend(request, params));
        return this.parseTrades(response, market, since, limit);
    }
    /**
     * @method
     * @name coinsph#fetchOrderTrades
     * @description fetch all the trades made from a single order
     * @see https://coins-docs.github.io/rest-api/#account-trade-list-user_data
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchOrderTrades(id, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchOrderTrades() requires a symbol argument');
        }
        const request = {
            'orderId': id,
        };
        return await this.fetchMyTrades(symbol, since, limit, this.extend(request, params));
    }
    parseTrade(trade, market = undefined) {
        //
        // fetchTrades
        //     {
        //         "price": "89685.8",
        //         "id": "1365561108437680129",
        //         "qty": "0.000004",
        //         "quoteQty": "0.000004000000000000", // warning: report to exchange - this is not quote quantity, this is base quantity
        //         "time": "1677523569575",
        //         "isBuyerMaker": false,
        //         "isBestMatch": true
        //     },
        //
        // fetchMyTrades
        //     {
        //         "symbol": "ETHUSDT",
        //         "id": 1375426310524125185,
        //         "orderId": 1375426310415879614,
        //         "price": "1580.91",
        //         "qty": "0.01",
        //         "quoteQty": "15.8091",
        //         "commission": "0",
        //         "commissionAsset": "USDT",
        //         "time": 1678699593307,
        //         "isBuyer": false,
        //         "isMaker":false,
        //         "isBestMatch":false
        //     }
        //
        // createOrder
        //     {
        //         "price": "1579.51",
        //         "qty": "0.001899",
        //         "commission": "0",
        //         "commissionAsset": "ETH",
        //         "tradeId":1375445992035598337
        //     }
        //
        const marketId = this.safeString(trade, 'symbol');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        const id = this.safeString2(trade, 'id', 'tradeId');
        const orderId = this.safeString(trade, 'orderId');
        const timestamp = this.safeInteger(trade, 'time');
        const priceString = this.safeString(trade, 'price');
        const amountString = this.safeString(trade, 'qty');
        const type = undefined;
        let fee = undefined;
        const feeCost = this.safeString(trade, 'commission');
        if (feeCost !== undefined) {
            const feeCurrencyId = this.safeString(trade, 'commissionAsset');
            fee = {
                'cost': feeCost,
                'currency': this.safeCurrencyCode(feeCurrencyId),
            };
        }
        const isBuyer = this.safeBool2(trade, 'isBuyer', 'isBuyerMaker', undefined);
        let side = undefined;
        if (isBuyer !== undefined) {
            side = (isBuyer === true) ? 'buy' : 'sell';
        }
        const isMaker = this.safeString2(trade, 'isMaker', undefined);
        let takerOrMaker = undefined;
        if (isMaker !== undefined) {
            takerOrMaker = (isMaker === 'true') ? 'maker' : 'taker';
        }
        let costString = undefined;
        if (orderId !== undefined) {
            costString = this.safeString(trade, 'quoteQty');
        }
        return this.safeTrade({
            'id': id,
            'order': orderId,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': priceString,
            'amount': amountString,
            'cost': costString,
            'fee': fee,
            'info': trade,
        }, market);
    }
    /**
     * @method
     * @name coinsph#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://coins-docs.github.io/rest-api/#accept-the-quote
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetOpenapiV1Account(params);
        //
        //     {
        //         "accountType": "SPOT",
        //         "balances": [
        //             {
        //                 "asset": "BTC",
        //                 "free": "4723846.89208129",
        //                 "locked": "0.00000000"
        //             },
        //             {
        //                 "asset": "LTC",
        //                 "free": "4763368.68006011",
        //                 "locked": "0.00000000"
        //             }
        //         ],
        //         "canDeposit": true,
        //         "canTrade": true,
        //         "canWithdraw": true,
        //         "updateTime": "1677430932528"
        //     }
        //
        return this.parseBalance(response);
    }
    parseBalance(response) {
        const balances = this.safeList(response, 'balances', []);
        const result = {
            'info': response,
            'timestamp': undefined,
            'datetime': undefined,
        };
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const currencyId = this.safeString(balance, 'asset');
            const code = this.safeCurrencyCode(currencyId);
            const account = this.account();
            account['free'] = this.safeString(balance, 'free');
            account['used'] = this.safeString(balance, 'locked');
            result[code] = account;
        }
        return this.safeBalance(result);
    }
    /**
     * @method
     * @name coinsph#createOrder
     * @description create a trade order
     * @see https://coins-docs.github.io/rest-api/#new-order--trade
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market', 'limit', 'stop_loss', 'take_profit', 'stop_loss_limit', 'take_profit_limit' or 'limit_maker'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {float} [params.cost] the quote quantity that can be used as an alternative for the amount for market buy orders
     * @param {bool} [params.test] set to true to test an order, no order will be created but the request will be validated
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder(symbol, type, side, amount, price = undefined, params = {}) {
        // todo: add test order low priority
        await this.loadMarkets();
        const market = this.market(symbol);
        const testOrder = this.safeBool(params, 'test', false);
        params = this.omit(params, 'test');
        let orderType = this.safeString(params, 'type', type);
        orderType = this.encodeOrderType(orderType);
        params = this.omit(params, 'type');
        const orderSide = this.encodeOrderSide(side);
        const request = {
            'symbol': market['id'],
            'type': orderType,
            'side': orderSide,
        };
        const options = this.safeValue(this.options, 'createOrder', {});
        let newOrderRespType = this.safeValue(options, 'newOrderRespType', {});
        // if limit order
        if (orderType === 'LIMIT' || orderType === 'STOP_LOSS_LIMIT' || orderType === 'TAKE_PROFIT_LIMIT' || orderType === 'LIMIT_MAKER') {
            if (price === undefined) {
                throw new errors.ArgumentsRequired(this.id + ' createOrder() requires a price argument for a ' + type + ' order');
            }
            newOrderRespType = this.safeString(newOrderRespType, 'limit', 'FULL');
            request['price'] = this.priceToPrecision(symbol, price);
            request['quantity'] = this.amountToPrecision(symbol, amount);
            if (orderType !== 'LIMIT_MAKER') {
                request['timeInForce'] = this.safeString(options, 'timeInForce', 'GTC');
            }
            // if market order
        }
        else if (orderType === 'MARKET' || orderType === 'STOP_LOSS' || orderType === 'TAKE_PROFIT') {
            newOrderRespType = this.safeString(newOrderRespType, 'market', 'FULL');
            if (orderSide === 'SELL') {
                request['quantity'] = this.amountToPrecision(symbol, amount);
            }
            else if (orderSide === 'BUY') {
                let quoteAmount = undefined;
                let createMarketBuyOrderRequiresPrice = true;
                [createMarketBuyOrderRequiresPrice, params] = this.handleOptionAndParams(params, 'createOrder', 'createMarketBuyOrderRequiresPrice', true);
                const cost = this.safeNumber2(params, 'cost', 'quoteOrderQty');
                params = this.omit(params, 'cost');
                if (cost !== undefined) {
                    quoteAmount = this.costToPrecision(symbol, cost);
                }
                else if (createMarketBuyOrderRequiresPrice) {
                    if (price === undefined) {
                        throw new errors.InvalidOrder(this.id + ' createOrder() requires the price argument for market buy orders to calculate the total cost to spend (amount * price), alternatively set the createMarketBuyOrderRequiresPrice option or param to false and pass the cost to spend in the amount argument');
                    }
                    else {
                        const amountString = this.numberToString(amount);
                        const priceString = this.numberToString(price);
                        const costRequest = Precise["default"].stringMul(amountString, priceString);
                        quoteAmount = this.costToPrecision(symbol, costRequest);
                    }
                }
                else {
                    quoteAmount = this.costToPrecision(symbol, amount);
                }
                request['quoteOrderQty'] = quoteAmount;
            }
        }
        if (orderType === 'STOP_LOSS' || orderType === 'STOP_LOSS_LIMIT' || orderType === 'TAKE_PROFIT' || orderType === 'TAKE_PROFIT_LIMIT') {
            const triggerPrice = this.safeString2(params, 'triggerPrice', 'stopPrice');
            if (triggerPrice === undefined) {
                throw new errors.InvalidOrder(this.id + ' createOrder () requires a triggerPrice or stopPrice param for stop_loss, take_profit, stop_loss_limit, and take_profit_limit orders');
            }
            request['stopPrice'] = this.priceToPrecision(symbol, triggerPrice);
        }
        request['newOrderRespType'] = newOrderRespType;
        params = this.omit(params, 'price', 'stopPrice', 'triggerPrice', 'quantity', 'quoteOrderQty');
        let response = undefined;
        if (testOrder) {
            response = await this.privatePostOpenapiV1OrderTest(this.extend(request, params));
        }
        else {
            response = await this.privatePostOpenapiV1Order(this.extend(request, params));
        }
        //
        //     {
        //         "symbol": "ETHUSDT",
        //         "orderId": "1375407140139731486",
        //         "clientOrderId": "1375407140139733169",
        //         "transactTime": "1678697308023",
        //         "price": "1600",
        //         "origQty": "0.02",
        //         "executedQty": "0.02",
        //         "cummulativeQuoteQty": "31.9284",
        //         "status": "FILLED",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0",
        //         "origQuoteOrderQty": "0",
        //         "fills": [
        //             {
        //                 "price": "1596.42",
        //                 "qty": "0.02",
        //                 "commission": "0",
        //                 "commissionAsset": "ETH",
        //                 "tradeId": "1375407140281532417"
        //             }
        //         ]
        //     },
        //
        return this.parseOrder(response, market);
    }
    /**
     * @method
     * @name coinsph#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://coins-docs.github.io/rest-api/#query-order-user_data
     * @param {int|string} id order id
     * @param {string} symbol not used by coinsph fetchOrder ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder(id, symbol = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        const clientOrderId = this.safeValue2(params, 'origClientOrderId', 'clientOrderId');
        if (clientOrderId !== undefined) {
            request['origClientOrderId'] = clientOrderId;
        }
        else {
            request['orderId'] = id;
        }
        params = this.omit(params, ['clientOrderId', 'origClientOrderId']);
        const response = await this.privateGetOpenapiV1Order(this.extend(request, params));
        return this.parseOrder(response);
    }
    /**
     * @method
     * @name coinsph#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://coins-docs.github.io/rest-api/#current-open-orders-user_data
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of  open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.privateGetOpenapiV1OpenOrders(this.extend(request, params));
        return this.parseOrders(response, market, since, limit);
    }
    /**
     * @method
     * @name coinsph#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://coins-docs.github.io/rest-api/#history-orders-user_data
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve (default 500, max 1000)
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders(symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' fetchClosedOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        if (since !== undefined) {
            request['startTime'] = since;
            // since work properly only when it is "younger" than last 'limit' order
            request['limit'] = 1000;
        }
        else if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOpenapiV1HistoryOrders(this.extend(request, params));
        return this.parseOrders(response, market, since, limit);
    }
    /**
     * @method
     * @name coinsph#cancelOrder
     * @description cancels an open order
     * @see https://coins-docs.github.io/rest-api/#cancel-order-trade
     * @param {string} id order id
     * @param {string} symbol not used by coinsph cancelOrder ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder(id, symbol = undefined, params = {}) {
        await this.loadMarkets();
        const request = {};
        const clientOrderId = this.safeValue2(params, 'origClientOrderId', 'clientOrderId');
        if (clientOrderId !== undefined) {
            request['origClientOrderId'] = clientOrderId;
        }
        else {
            request['orderId'] = id;
        }
        params = this.omit(params, ['clientOrderId', 'origClientOrderId']);
        const response = await this.privateDeleteOpenapiV1Order(this.extend(request, params));
        return this.parseOrder(response);
    }
    /**
     * @method
     * @name coinsph#cancelAllOrders
     * @description cancel open orders of market
     * @see https://coins-docs.github.io/rest-api/#cancel-all-open-orders-on-a-symbol-trade
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelAllOrders(symbol = undefined, params = {}) {
        if (symbol === undefined) {
            throw new errors.ArgumentsRequired(this.id + ' cancelAllOrders() requires a symbol argument');
        }
        await this.loadMarkets();
        let market = undefined;
        const request = {};
        if (symbol !== undefined) {
            market = this.market(symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.privateDeleteOpenapiV1OpenOrders(this.extend(request, params));
        return this.parseOrders(response, market);
    }
    parseOrder(order, market = undefined) {
        //
        // createOrder POST /openapi/v1/order
        //     {
        //         "symbol": "ETHUSDT",
        //         "orderId": 1375445991893797391,
        //         "clientOrderId": "1375445991893799115",
        //         "transactTime": 1678701939513,
        //         "price": "0",
        //         "origQty": "0",
        //         "executedQty": "0.001899",
        //         "cummulativeQuoteQty": "2.99948949",
        //         "status": "FILLED",
        //         "timeInForce": "GTC",
        //         "type": "MARKET",
        //         "side": "BUY",
        //         "stopPrice": "0",
        //         "origQuoteOrderQty": "3",
        //         "fills": [
        //             {
        //                 "price": "1579.51",
        //                 "qty": "0.001899",
        //                 "commission": "0",
        //                 "commissionAsset": "ETH",
        //                 "tradeId":1375445992035598337
        //             }
        //         ]
        //     }
        //
        // fetchOrder GET /openapi/v1/order
        // fetchOpenOrders GET /openapi/v1/openOrders
        // fetchClosedOrders GET /openapi/v1/historyOrders
        // cancelAllOrders DELETE /openapi/v1/openOrders
        //     {
        //         "symbol": "DOGEPHP",
        //         "orderId":1375465375097982423,
        //         "clientOrderId": "1375465375098001241",
        //         "price": "0",
        //         "origQty": "0",
        //         "executedQty": "13",
        //         "cummulativeQuoteQty": "49.621",
        //         "status": "FILLED",
        //         "timeInForce": "GTC",
        //         "type": "MARKET",
        //         "side": "BUY",
        //         "stopPrice": "0",
        //         "time":1678704250171,
        //         "updateTime":1678704250256,
        //         "isWorking":false,
        //         "origQuoteOrderQty": "50"
        //     }
        //
        // cancelOrder DELETE /openapi/v1/order
        //     {
        //         "symbol": "ETHPHP",
        //         "orderId":1375609441915774332,
        //         "clientOrderId": "1375609441915899557",
        //         "price": "96000",
        //         "origQty": "0.001",
        //         "executedQty": "0",
        //         "cummulativeQuoteQty": "0",
        //         "status": "CANCELED",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "SELL",
        //         "stopPrice": "0",
        //         "origQuoteOrderQty": "0"
        //     }
        //
        const id = this.safeString(order, 'orderId');
        const marketId = this.safeString(order, 'symbol');
        market = this.safeMarket(marketId, market);
        const timestamp = this.safeInteger2(order, 'time', 'transactTime');
        const trades = this.safeValue(order, 'fills', undefined);
        let triggerPrice = this.safeString(order, 'stopPrice');
        if (Precise["default"].stringEq(triggerPrice, '0')) {
            triggerPrice = undefined;
        }
        return this.safeOrder({
            'id': id,
            'clientOrderId': this.safeString(order, 'clientOrderId'),
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'lastTradeTimestamp': undefined,
            'status': this.parseOrderStatus(this.safeString(order, 'status')),
            'symbol': market['symbol'],
            'type': this.parseOrderType(this.safeString(order, 'type')),
            'timeInForce': this.parseOrderTimeInForce(this.safeString(order, 'timeInForce')),
            'side': this.parseOrderSide(this.safeString(order, 'side')),
            'price': this.safeString(order, 'price'),
            'triggerPrice': triggerPrice,
            'average': undefined,
            'amount': this.safeString(order, 'origQty'),
            'cost': this.safeString(order, 'cummulativeQuoteQty'),
            'filled': this.safeString(order, 'executedQty'),
            'remaining': undefined,
            'fee': undefined,
            'fees': undefined,
            'trades': trades,
            'info': order,
        }, market);
    }
    parseOrderSide(status) {
        const statuses = {
            'BUY': 'buy',
            'SELL': 'sell',
        };
        return this.safeString(statuses, status, status);
    }
    encodeOrderSide(status) {
        const statuses = {
            'buy': 'BUY',
            'sell': 'SELL',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrderType(status) {
        const statuses = {
            'MARKET': 'market',
            'LIMIT': 'limit',
            'LIMIT_MAKER': 'limit',
            'STOP_LOSS': 'market',
            'STOP_LOSS_LIMIT': 'limit',
            'TAKE_PROFIT': 'market',
            'TAKE_PROFIT_LIMIT': 'limit',
        };
        return this.safeString(statuses, status, status);
    }
    encodeOrderType(status) {
        const statuses = {
            'market': 'MARKET',
            'limit': 'LIMIT',
            'limit_maker': 'LIMIT_MAKER',
            'stop_loss': 'STOP_LOSS',
            'stop_loss_limit': 'STOP_LOSS_LIMIT',
            'take_profit': 'TAKE_PROFIT',
            'take_profit_limit': 'TAKE_PROFIT_LIMIT',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrderStatus(status) {
        const statuses = {
            'NEW': 'open',
            'FILLED': 'closed',
            'CANCELED': 'canceled',
            'PARTIALLY_FILLED': 'open',
            'PARTIALLY_CANCELED': 'canceled',
            'REJECTED': 'rejected',
        };
        return this.safeString(statuses, status, status);
    }
    parseOrderTimeInForce(status) {
        const statuses = {
            'GTC': 'GTC',
            'FOK': 'FOK',
            'IOC': 'IOC',
        };
        return this.safeString(statuses, status, status);
    }
    /**
     * @method
     * @name coinsph#fetchTradingFee
     * @description fetch the trading fees for a market
     * @see https://coins-docs.github.io/rest-api/#trade-fee-user_data
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee(symbol, params = {}) {
        await this.loadMarkets();
        const market = this.market(symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.privateGetOpenapiV1AssetTradeFee(this.extend(request, params));
        //
        //     [
        //       {
        //         "symbol": "ETHUSDT",
        //         "makerCommission": "0.0025",
        //         "takerCommission": "0.003"
        //       }
        //     ]
        //
        const tradingFee = this.safeDict(response, 0, {});
        return this.parseTradingFee(tradingFee, market);
    }
    /**
     * @method
     * @name coinsph#fetchTradingFees
     * @description fetch the trading fees for multiple markets
     * @see https://coins-docs.github.io/rest-api/#trade-fee-user_data
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure} indexed by market symbols
     */
    async fetchTradingFees(params = {}) {
        await this.loadMarkets();
        const response = await this.privateGetOpenapiV1AssetTradeFee(params);
        //
        //     [
        //         {
        //             "symbol": "ETHPHP",
        //             "makerCommission": "0.0025",
        //             "takerCommission": "0.003"
        //         },
        //         {
        //             "symbol": "UNIPHP",
        //             "makerCommission": "0.0025",
        //             "takerCommission": "0.003"
        //         },
        //     ]
        //
        const result = {};
        for (let i = 0; i < response.length; i++) {
            const fee = this.parseTradingFee(response[i]);
            const symbol = fee['symbol'];
            result[symbol] = fee;
        }
        return result;
    }
    parseTradingFee(fee, market = undefined) {
        //
        //     {
        //         "symbol": "ETHUSDT",
        //         "makerCommission": "0.0025",
        //         "takerCommission": "0.003"
        //     }
        //
        const marketId = this.safeString(fee, 'symbol');
        market = this.safeMarket(marketId, market);
        const symbol = market['symbol'];
        return {
            'info': fee,
            'symbol': symbol,
            'maker': this.safeNumber(fee, 'makerCommission'),
            'taker': this.safeNumber(fee, 'takerCommission'),
            'percentage': undefined,
            'tierBased': undefined,
        };
    }
    /**
     * @method
     * @name coinsph#withdraw
     * @description make a withdrawal to coins_ph account
     * @see https://coins-docs.github.io/rest-api/#withdrawuser_data
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address not used by coinsph withdraw ()
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw(code, amount, address, tag = undefined, params = {}) {
        const options = this.safeValue(this.options, 'withdraw');
        const warning = this.safeBool(options, 'warning', true);
        if (warning) {
            throw new errors.InvalidAddress(this.id + " withdraw() makes a withdrawals only to coins_ph account, add .options['withdraw']['warning'] = false to make a withdrawal to your coins_ph account");
        }
        const networkCode = this.safeString(params, 'network');
        const networkId = this.networkCodeToId(networkCode, code);
        if (networkId === undefined) {
            throw new errors.BadRequest(this.id + ' withdraw() require network parameter');
        }
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'coin': currency['id'],
            'amount': this.numberToString(amount),
            'network': networkId,
            'address': address,
        };
        if (tag !== undefined) {
            request['withdrawOrderId'] = tag;
        }
        params = this.omit(params, 'network');
        const response = await this.privatePostOpenapiWalletV1WithdrawApply(this.extend(request, params));
        return this.parseTransaction(response, currency);
    }
    /**
     * @method
     * @name coinsph#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://coins-docs.github.io/rest-api/#deposit-history-user_data
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits(code = undefined, since = undefined, limit = undefined, params = {}) {
        // todo: returns an empty array - find out why
        await this.loadMarkets();
        let currency = undefined;
        const request = {};
        if (code !== undefined) {
            currency = this.currency(code);
            request['coin'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOpenapiWalletV1DepositHistory(this.extend(request, params));
        //
        // [
        //     {
        //         "id": "d_769800519366885376",
        //         "amount": "0.001",
        //         "coin": "BNB",
        //         "network": "BNB",
        //         "status": 0,
        //         "address": "bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23",
        //         "addressTag": "101764890",
        //         "txId": "98A3EA560C6B3336D348B6C83F0F95ECE4F1F5919E94BD006E5BF3BF264FACFC",
        //         "insertTime": 1661493146000,
        //         "confirmNo": 10,
        //     },
        //     {
        //         "id": "d_769754833590042625",
        //         "amount":"0.5",
        //         "coin":"IOTA",
        //         "network":"IOTA",
        //         "status":1,
        //         "address":"SIZ9VLMHWATXKV99LH99CIGFJFUMLEHGWVZVNNZXRJJVWBPHYWPPBOSDORZ9EQSHCZAMPVAPGFYQAUUV9DROOXJLNW",
        //         "addressTag":"",
        //         "txId":"ESBFVQUTPIWQNJSPXFNHNYHSQNTGKRVKPRABQWTAXCDWOAKDKYWPTVG9BGXNVNKTLEJGESAVXIKIZ9999",
        //         "insertTime":1599620082000,
        //         "confirmNo": 20,
        //     }
        // ]
        //
        return this.parseTransactions(response, currency, since, limit);
    }
    /**
     * @method
     * @name coinsph#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://coins-docs.github.io/rest-api/#withdraw-history-user_data
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals(code = undefined, since = undefined, limit = undefined, params = {}) {
        // todo: returns an empty array - find out why
        await this.loadMarkets();
        let currency = undefined;
        const request = {};
        if (code !== undefined) {
            currency = this.currency(code);
            request['coin'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.privateGetOpenapiWalletV1WithdrawHistory(this.extend(request, params));
        //
        // [
        //     {
        //         "id": "459890698271244288",
        //         "amount": "0.01",
        //         "transactionFee": "0",
        //         "coin": "ETH",
        //         "status": 1,
        //         "address": "0x386AE30AE2dA293987B5d51ddD03AEb70b21001F",
        //         "addressTag": "",
        //         "txId": "0x4ae2fed36a90aada978fc31c38488e8b60d7435cfe0b4daed842456b4771fcf7",
        //         "applyTime": 1673601139000,
        //         "network": "ETH",
        //         "withdrawOrderId": "thomas123",
        //         "info": "",
        //         "confirmNo": 100
        //     },
        //     {
        //         "id": "451899190746456064",
        //         "amount": "0.00063",
        //         "transactionFee": "0.00037",
        //         "coin": "ETH",
        //         "status": 1,
        //         "address": "0x386AE30AE2dA293987B5d51ddD03AEb70b21001F",
        //         "addressTag": "",
        //         "txId": "0x62690ca4f9d6a8868c258e2ce613805af614d9354dda7b39779c57b2e4da0260",
        //         "applyTime": 1671695815000,
        //         "network": "ETH",
        //         "withdrawOrderId": "",
        //         "info": "",
        //         "confirmNo": 100
        //     }
        // ]
        //
        return this.parseTransactions(response, currency, since, limit);
    }
    parseTransaction(transaction, currency = undefined) {
        //
        // fetchDeposits
        //     {
        //         "coin": "PHP",
        //         "address": "Internal Transfer",
        //         "addressTag": "Internal Transfer",
        //         "amount": "0.02",
        //         "id": "31312321312312312312322",
        //         "network": "Internal",
        //         "transferType": "0",
        //         "status": 3,
        //         "confirmTimes": "",
        //         "unlockConfirm": "",
        //         "txId": "Internal Transfer",
        //         "insertTime": 1657623798000,
        //         "depositOrderId": "the deposit id which created by client"
        //     }
        //
        // fetchWithdrawals
        //     {
        //         "coin": "BTC",
        //         "address": "Internal Transfer",
        //         "amount": "0.1",
        //         "id": "1201515362324421632",
        //         "withdrawOrderId": null,
        //         "network": "Internal",
        //         "transferType": "0",
        //         "status": 0,
        //         "transactionFee": "0",
        //         "confirmNo": 0,
        //         "info": "{}",
        //         "txId": "Internal Transfer",
        //         "applyTime": 1657967792000
        //     }
        //
        // todo: this is in progress
        const id = this.safeString(transaction, 'id');
        const address = this.safeString(transaction, 'address');
        let tag = this.safeString(transaction, 'addressTag');
        if (tag !== undefined) {
            if (tag.length < 1) {
                tag = undefined;
            }
        }
        const txid = this.safeString(transaction, 'txId');
        const currencyId = this.safeString(transaction, 'coin');
        const code = this.safeCurrencyCode(currencyId, currency);
        let timestamp = undefined;
        timestamp = this.safeInteger2(transaction, 'insertTime', 'applyTime');
        const updated = undefined;
        let type = undefined;
        const withdrawOrderId = this.safeString(transaction, 'withdrawOrderId');
        const depositOrderId = this.safeString(transaction, 'depositOrderId');
        if (withdrawOrderId !== undefined) {
            type = 'withdrawal';
        }
        else if (depositOrderId !== undefined) {
            type = 'deposit';
        }
        const status = this.parseTransactionStatus(this.safeString(transaction, 'status'));
        const amount = this.safeNumber(transaction, 'amount');
        const feeCost = this.safeNumber(transaction, 'transactionFee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = { 'currency': code, 'cost': feeCost };
        }
        const network = this.safeString(transaction, 'network');
        const internal = network === 'Internal';
        return {
            'info': transaction,
            'id': id,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601(timestamp),
            'network': network,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': type,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': updated,
            'internal': internal,
            'comment': undefined,
            'fee': fee,
        };
    }
    parseTransactionStatus(status) {
        const statuses = {
            '0': 'pending',
            '1': 'ok',
            '2': 'failed',
            '3': 'pending',
        };
        return this.safeString(statuses, status, status);
    }
    /**
     * @method
     * @name coinsph#fetchDepositAddress
     * @description fetch the deposit address for a currency associated with this account
     * @see https://coins-docs.github.io/rest-api/#deposit-address-user_data
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.network] network for fetch deposit address
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async fetchDepositAddress(code, params = {}) {
        const networkCode = this.safeString(params, 'network');
        const networkId = this.networkCodeToId(networkCode, code);
        if (networkId === undefined) {
            throw new errors.BadRequest(this.id + ' fetchDepositAddress() require network parameter');
        }
        await this.loadMarkets();
        const currency = this.currency(code);
        const request = {
            'coin': currency['id'],
            'network': networkId,
        };
        params = this.omit(params, 'network');
        const response = await this.privateGetOpenapiWalletV1DepositAddress(this.extend(request, params));
        //
        //     {
        //         "coin": "ETH",
        //         "address": "0xfe98628173830bf79c59f04585ce41f7de168784",
        //         "addressTag": ""
        //     }
        //
        return this.parseDepositAddress(response, currency);
    }
    parseDepositAddress(depositAddress, currency = undefined) {
        //
        //     {
        //         "coin": "ETH",
        //         "address": "0xfe98628173830bf79c59f04585ce41f7de168784",
        //         "addressTag": ""
        //     }
        //
        const currencyId = this.safeString(depositAddress, 'coin');
        const parsedCurrency = this.safeCurrencyCode(currencyId, currency);
        return {
            'info': depositAddress,
            'currency': parsedCurrency,
            'network': null,
            'address': this.safeString(depositAddress, 'address'),
            'tag': this.safeString(depositAddress, 'addressTag'),
        };
    }
    urlEncodeQuery(query = {}) {
        let encodedArrayParams = '';
        const keys = Object.keys(query);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (Array.isArray(query[key])) {
                if (i !== 0) {
                    encodedArrayParams += '&';
                }
                const innerArray = query[key];
                query = this.omit(query, key);
                const encodedArrayParam = this.parseArrayParam(innerArray, key);
                encodedArrayParams += encodedArrayParam;
            }
        }
        const encodedQuery = this.urlencode(query);
        if (encodedQuery.length !== 0) {
            return encodedQuery + '&' + encodedArrayParams;
        }
        else {
            return encodedArrayParams;
        }
    }
    parseArrayParam(array, key) {
        let stringifiedArray = this.json(array);
        stringifiedArray = stringifiedArray.replace('[', '%5B');
        stringifiedArray = stringifiedArray.replace(']', '%5D');
        const urlEncodedParam = key + '=' + stringifiedArray;
        return urlEncodedParam;
    }
    sign(path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api];
        let query = this.omit(params, this.extractParams(path));
        const endpoint = this.implodeParams(path, params);
        url = url + '/' + endpoint;
        if (api === 'private') {
            this.checkRequiredCredentials();
            query['timestamp'] = this.milliseconds();
            const recvWindow = this.safeInteger(query, 'recvWindow');
            if (recvWindow === undefined) {
                const defaultRecvWindow = this.safeInteger(this.options, 'recvWindow');
                if (defaultRecvWindow !== undefined) {
                    query['recvWindow'] = defaultRecvWindow;
                }
            }
            query = this.urlEncodeQuery(query);
            const signature = this.hmac(this.encode(query), this.encode(this.secret), sha256.sha256);
            url = url + '?' + query + '&signature=' + signature;
            headers = {
                'X-COINS-APIKEY': this.apiKey,
            };
        }
        else {
            query = this.urlEncodeQuery(query);
            if (query.length !== 0) {
                url += '?' + query;
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }
    handleErrors(code, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined;
        }
        const responseCode = this.safeString(response, 'code', undefined);
        if ((responseCode !== undefined) && (responseCode !== '200') && (responseCode !== '0')) {
            const feedback = this.id + ' ' + body;
            this.throwBroadlyMatchedException(this.exceptions['broad'], body, feedback);
            this.throwExactlyMatchedException(this.exceptions['exact'], responseCode, feedback);
            throw new errors.ExchangeError(feedback);
        }
        return undefined;
    }
}

module.exports = coinsph;
