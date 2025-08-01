
//  ---------------------------------------------------------------------------

import Exchange from './abstract/htx.js';
import { AccountNotEnabled, ArgumentsRequired, AuthenticationError, ExchangeError, PermissionDenied, ExchangeNotAvailable, OnMaintenance, InvalidOrder, OrderNotFound, InsufficientFunds, BadSymbol, BadRequest, RateLimitExceeded, RequestTimeout, OperationFailed, NotSupported } from './base/errors.js';
import { Precise } from './base/Precise.js';
import { TICK_SIZE, TRUNCATE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import type { TransferEntry, Int, OrderSide, OrderType, Order, OHLCV, Trade, FundingRateHistory, Balances, Str, Dict, Transaction, Ticker, OrderBook, Tickers, OrderRequest, Strings, Market, Currency, Num, Account, TradingFeeInterface, Currencies, IsolatedBorrowRates, IsolatedBorrowRate, LeverageTiers, LeverageTier, int, LedgerEntry, FundingRate, FundingRates, DepositAddress, BorrowInterest, OpenInterests, Position } from './base/types.js';

//  ---------------------------------------------------------------------------

/**
 * @class htx
 * @augments Exchange
 */
export default class htx extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'htx',
            'name': 'HTX',
            'countries': [ 'CN' ],
            'rateLimit': 100,
            'userAgent': this.userAgents['chrome100'],
            'certified': true,
            'version': 'v1',
            'hostname': 'api.huobi.pro', // api.testnet.huobi.pro
            'pro': true,
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': undefined,
                'addMargin': undefined,
                'borrowCrossMargin': true,
                'borrowIsolatedMargin': true,
                'cancelAllOrders': true,
                'cancelAllOrdersAfter': true,
                'cancelOrder': true,
                'cancelOrders': true,
                'closeAllPositions': false,
                'closePosition': true,
                'createDepositAddress': undefined,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': true,
                'createReduceOnlyOrder': false,
                'createStopLimitOrder': true,
                'createStopLossOrder': true,
                'createStopMarketOrder': true,
                'createStopOrder': true,
                'createTakeProfitOrder': true,
                'createTrailingPercentOrder': true,
                'createTriggerOrder': true,
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchBidsAsks': undefined,
                'fetchBorrowInterest': true,
                'fetchBorrowRateHistories': undefined,
                'fetchBorrowRateHistory': undefined,
                'fetchCanceledOrders': undefined,
                'fetchClosedOrder': undefined,
                'fetchClosedOrders': true,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': undefined,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': undefined,
                'fetchDepositAddressesByNetwork': true,
                'fetchDeposits': true,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchIndexOHLCV': true,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': true,
                'fetchL3OrderBook': undefined,
                'fetchLastPrices': true,
                'fetchLedger': true,
                'fetchLedgerEntry': undefined,
                'fetchLeverage': false,
                'fetchLeverageTiers': true,
                'fetchLiquidations': true,
                'fetchMarginAdjustmentHistory': false,
                'fetchMarketLeverageTiers': 'emulated',
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMyLiquidations': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': true,
                'fetchOpenInterests': true,
                'fetchOpenOrder': undefined,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': undefined,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': true,
                'fetchPositionHistory': 'emulated',
                'fetchPositions': true,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': true,
                'fetchSettlementHistory': true,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': false,
                'fetchTradingLimits': true,
                'fetchTransactionFee': undefined,
                'fetchTransactionFees': undefined,
                'fetchTransactions': undefined,
                'fetchTransfers': undefined,
                'fetchWithdrawAddresses': true,
                'fetchWithdrawal': undefined,
                'fetchWithdrawals': true,
                'fetchWithdrawalWhitelist': undefined,
                'reduceMargin': undefined,
                'repayCrossMargin': true,
                'repayIsolatedMargin': true,
                'setLeverage': true,
                'setMarginMode': false,
                'setPositionMode': true,
                'signIn': undefined,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1m': '1min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '60min',
                '4h': '4hour',
                '1d': '1day',
                '1w': '1week',
                '1M': '1mon',
                '1y': '1year',
            },
            'urls': {
                // 'test': {
                //     'market': 'https://api.testnet.huobi.pro',
                //     'public': 'https://api.testnet.huobi.pro',
                //     'private': 'https://api.testnet.huobi.pro',
                // },
                'logo': 'https://user-images.githubusercontent.com/1294454/76137448-22748a80-604e-11ea-8069-6e389271911d.jpg',
                'hostnames': {
                    'contract': 'api.hbdm.com',
                    'spot': 'api.huobi.pro',
                    'status': {
                        'spot': 'status.huobigroup.com',
                        'future': {
                            'inverse': 'status-dm.huobigroup.com',
                            'linear': 'status-linear-swap.huobigroup.com', // USDT-Margined Contracts
                        },
                        'swap': {
                            'inverse': 'status-swap.huobigroup.com',
                            'linear': 'status-linear-swap.huobigroup.com', // USDT-Margined Contracts
                        },
                    },
                    // recommended for AWS
                    // 'contract': 'api.hbdm.vn',
                    // 'spot': 'api-aws.huobi.pro',
                },
                'api': {
                    'status': 'https://{hostname}',
                    'contract': 'https://{hostname}',
                    'spot': 'https://{hostname}',
                    'public': 'https://{hostname}',
                    'private': 'https://{hostname}',
                    'v2Public': 'https://{hostname}',
                    'v2Private': 'https://{hostname}',
                },
                'www': 'https://www.huobi.com',
                'referral': {
                    'url': 'https://www.htx.com.vc/invite/en-us/1h?invite_code=6rmm2223',
                    'discount': 0.15,
                },
                'doc': [
                    'https://huobiapi.github.io/docs/spot/v1/en/',
                    'https://huobiapi.github.io/docs/dm/v1/en/',
                    'https://huobiapi.github.io/docs/coin_margined_swap/v1/en/',
                    'https://huobiapi.github.io/docs/usdt_swap/v1/en/',
                    'https://www.huobi.com/en-us/opend/newApiPages/',
                ],
                'fees': 'https://www.huobi.com/about/fee/',
            },
            'api': {
                // ------------------------------------------------------------
                // old api definitions
                'v2Public': {
                    'get': {
                        'reference/currencies': 1, // 币链参考信息
                        'market-status': 1, // 获取当前市场状态
                    },
                },
                'v2Private': {
                    'get': {
                        'account/ledger': 1,
                        'account/withdraw/quota': 1,
                        'account/withdraw/address': 1, // 提币地址查询(限母用户可用)
                        'account/deposit/address': 1,
                        'account/repayment': 5, // 还币交易记录查询
                        'reference/transact-fee-rate': 1,
                        'account/asset-valuation': 0.2, // 获取账户资产估值
                        'point/account': 5, // 点卡余额查询
                        'sub-user/user-list': 1, // 获取子用户列表
                        'sub-user/user-state': 1, // 获取特定子用户的用户状态
                        'sub-user/account-list': 1, // 获取特定子用户的账户列表
                        'sub-user/deposit-address': 1, // 子用户充币地址查询
                        'sub-user/query-deposit': 1, // 子用户充币记录查询
                        'user/api-key': 1, // 母子用户API key信息查询
                        'user/uid': 1, // 母子用户获取用户UID
                        'algo-orders/opening': 1, // 查询未触发OPEN策略委托
                        'algo-orders/history': 1, // 查询策略委托历史
                        'algo-orders/specific': 1, // 查询特定策略委托
                        'c2c/offers': 1, // 查询借入借出订单
                        'c2c/offer': 1, // 查询特定借入借出订单及其交易记录
                        'c2c/transactions': 1, // 查询借入借出交易记录
                        'c2c/repayment': 1, // 查询还币交易记录
                        'c2c/account': 1, // 查询账户余额
                        'etp/reference': 1, // 基础参考信息
                        'etp/transactions': 5, // 获取杠杆ETP申赎记录
                        'etp/transaction': 5, // 获取特定杠杆ETP申赎记录
                        'etp/rebalance': 1, // 获取杠杆ETP调仓记录
                        'etp/limit': 1, // 获取ETP持仓限额
                    },
                    'post': {
                        'account/transfer': 1,
                        'account/repayment': 5, // 归还借币（全仓逐仓通用）
                        'point/transfer': 5, // 点卡划转
                        'sub-user/management': 1, // 冻结/解冻子用户
                        'sub-user/creation': 1, // 子用户创建
                        'sub-user/tradable-market': 1, // 设置子用户交易权限
                        'sub-user/transferability': 1, // 设置子用户资产转出权限
                        'sub-user/api-key-generation': 1, // 子用户API key创建
                        'sub-user/api-key-modification': 1, // 修改子用户API key
                        'sub-user/api-key-deletion': 1, // 删除子用户API key
                        'sub-user/deduct-mode': 1, // 设置子用户手续费抵扣模式
                        'algo-orders': 1, // 策略委托下单
                        'algo-orders/cancel-all-after': 1, // 自动撤销订单
                        'algo-orders/cancellation': 1, // 策略委托（触发前）撤单
                        'c2c/offer': 1, // 借入借出下单
                        'c2c/cancellation': 1, // 借入借出撤单
                        'c2c/cancel-all': 1, // 撤销所有借入借出订单
                        'c2c/repayment': 1, // 还币
                        'c2c/transfer': 1, // 资产划转
                        'etp/creation': 5, // 杠杆ETP换入
                        'etp/redemption': 5, // 杠杆ETP换出
                        'etp/{transactId}/cancel': 10, // 杠杆ETP单个撤单
                        'etp/batch-cancel': 50, // 杠杆ETP批量撤单
                    },
                },
                'public': {
                    'get': {
                        'common/symbols': 1, // 查询系统支持的所有交易对
                        'common/currencys': 1, // 查询系统支持的所有币种
                        'common/timestamp': 1, // 查询系统当前时间
                        'common/exchange': 1, // order limits
                        'settings/currencys': 1, // ?language=en-US
                    },
                },
                'private': {
                    'get': {
                        'account/accounts': 0.2, // 查询当前用户的所有账户(即account-id)
                        'account/accounts/{id}/balance': 0.2, // 查询指定账户的余额
                        'account/accounts/{sub-uid}': 1,
                        'account/history': 4,
                        'cross-margin/loan-info': 1,
                        'margin/loan-info': 1, // 查询借币币息率及额度
                        'fee/fee-rate/get': 1,
                        'order/openOrders': 0.4,
                        'order/orders': 0.4,
                        'order/orders/{id}': 0.4, // 查询某个订单详情
                        'order/orders/{id}/matchresults': 0.4, // 查询某个订单的成交明细
                        'order/orders/getClientOrder': 0.4,
                        'order/history': 1, // 查询当前委托、历史委托
                        'order/matchresults': 1, // 查询当前成交、历史成交
                        // 'dw/withdraw-virtual/addresses', // 查询虚拟币提现地址（Deprecated）
                        'query/deposit-withdraw': 1,
                        // 'margin/loan-info', // duplicate
                        'margin/loan-orders': 0.2, // 借贷订单
                        'margin/accounts/balance': 0.2, // 借贷账户详情
                        'cross-margin/loan-orders': 1, // 查询借币订单
                        'cross-margin/accounts/balance': 1, // 借币账户详情
                        'points/actions': 1,
                        'points/orders': 1,
                        'subuser/aggregate-balance': 10,
                        'stable-coin/exchange_rate': 1,
                        'stable-coin/quote': 1,
                    },
                    'post': {
                        'account/transfer': 1, // 资产划转(该节点为母用户和子用户进行资产划转的通用接口。)
                        'futures/transfer': 1,
                        'order/batch-orders': 0.4,
                        'order/orders/place': 0.2, // 创建并执行一个新订单 (一步下单， 推荐使用)
                        'order/orders/submitCancelClientOrder': 0.2,
                        'order/orders/batchCancelOpenOrders': 0.4,
                        // 'order/orders', // 创建一个新的订单请求 （仅创建订单，不执行下单）
                        // 'order/orders/{id}/place', // 执行一个订单 （仅执行已创建的订单）
                        'order/orders/{id}/submitcancel': 0.2, // 申请撤销一个订单请求
                        'order/orders/batchcancel': 0.4, // 批量撤销订单
                        // 'dw/balance/transfer', // 资产划转
                        'dw/withdraw/api/create': 1, // 申请提现虚拟币
                        // 'dw/withdraw-virtual/create', // 申请提现虚拟币
                        // 'dw/withdraw-virtual/{id}/place', // 确认申请虚拟币提现（Deprecated）
                        'dw/withdraw-virtual/{id}/cancel': 1, // 申请取消提现虚拟币
                        'dw/transfer-in/margin': 10, // 现货账户划入至借贷账户
                        'dw/transfer-out/margin': 10, // 借贷账户划出至现货账户
                        'margin/orders': 10, // 申请借贷
                        'margin/orders/{id}/repay': 10, // 归还借贷
                        'cross-margin/transfer-in': 1, // 资产划转
                        'cross-margin/transfer-out': 1, // 资产划转
                        'cross-margin/orders': 1, // 申请借币
                        'cross-margin/orders/{id}/repay': 1, // 归还借币
                        'stable-coin/exchange': 1,
                        'subuser/transfer': 10,
                    },
                },
                // ------------------------------------------------------------
                // new api definitions
                // 'https://status.huobigroup.com/api/v2/summary.json': 1,
                // 'https://status-dm.huobigroup.com/api/v2/summary.json': 1,
                // 'https://status-swap.huobigroup.com/api/v2/summary.json': 1,
                // 'https://status-linear-swap.huobigroup.com/api/v2/summary.json': 1,
                'status': {
                    'public': {
                        'spot': {
                            'get': {
                                'api/v2/summary.json': 1,
                            },
                        },
                        'future': {
                            'inverse': {
                                'get': {
                                    'api/v2/summary.json': 1,
                                },
                            },
                            'linear': {
                                'get': {
                                    'api/v2/summary.json': 1,
                                },
                            },
                        },
                        'swap': {
                            'inverse': {
                                'get': {
                                    'api/v2/summary.json': 1,
                                },
                            },
                            'linear': {
                                'get': {
                                    'api/v2/summary.json': 1,
                                },
                            },
                        },
                    },
                },
                'spot': {
                    'public': {
                        'get': {
                            'v2/market-status': 1,
                            'v1/common/symbols': 1,
                            'v1/common/currencys': 1,
                            'v2/settings/common/currencies': 1,
                            'v2/reference/currencies': 1,
                            'v1/common/timestamp': 1,
                            'v1/common/exchange': 1, // order limits
                            'v1/settings/common/chains': 1,
                            'v1/settings/common/currencys': 1,
                            'v1/settings/common/symbols': 1,
                            'v2/settings/common/symbols': 1,
                            'v1/settings/common/market-symbols': 1,
                            // Market Data
                            'market/history/candles': 1,
                            'market/history/kline': 1,
                            'market/detail/merged': 1,
                            'market/tickers': 1,
                            'market/detail': 1,
                            'market/depth': 1,
                            'market/trade': 1,
                            'market/history/trade': 1,
                            'market/etp': 1, // Get real-time equity of leveraged ETP
                            // ETP
                            'v2/etp/reference': 1,
                            'v2/etp/rebalance': 1,
                        },
                    },
                    'private': {
                        'get': {
                            // Account
                            'v1/account/accounts': 0.2,
                            'v1/account/accounts/{account-id}/balance': 0.2,
                            'v2/account/valuation': 1,
                            'v2/account/asset-valuation': 0.2,
                            'v1/account/history': 4,
                            'v2/account/ledger': 1,
                            'v2/point/account': 5,
                            // Wallet (Deposit and Withdraw)
                            'v2/account/deposit/address': 1,
                            'v2/account/withdraw/quota': 1,
                            'v2/account/withdraw/address': 1,
                            'v2/reference/currencies': 1,
                            'v1/query/deposit-withdraw': 1,
                            'v1/query/withdraw/client-order-id': 1,
                            // Sub user management
                            'v2/user/api-key': 1,
                            'v2/user/uid': 1,
                            'v2/sub-user/user-list': 1,
                            'v2/sub-user/user-state': 1,
                            'v2/sub-user/account-list': 1,
                            'v2/sub-user/deposit-address': 1,
                            'v2/sub-user/query-deposit': 1,
                            'v1/subuser/aggregate-balance': 10,
                            'v1/account/accounts/{sub-uid}': 1,
                            // Trading
                            'v1/order/openOrders': 0.4,
                            'v1/order/orders/{order-id}': 0.4,
                            'v1/order/orders/getClientOrder': 0.4,
                            'v1/order/orders/{order-id}/matchresult': 0.4,
                            'v1/order/orders/{order-id}/matchresults': 0.4,
                            'v1/order/orders': 0.4,
                            'v1/order/history': 1,
                            'v1/order/matchresults': 1,
                            'v2/reference/transact-fee-rate': 1,
                            // Conditional Order
                            'v2/algo-orders/opening': 1,
                            'v2/algo-orders/history': 1,
                            'v2/algo-orders/specific': 1,
                            // Margin Loan (Cross/Isolated)
                            'v1/margin/loan-info': 1,
                            'v1/margin/loan-orders': 0.2,
                            'v1/margin/accounts/balance': 0.2,
                            'v1/cross-margin/loan-info': 1,
                            'v1/cross-margin/loan-orders': 1,
                            'v1/cross-margin/accounts/balance': 1,
                            'v2/account/repayment': 5,
                            // Stable Coin Exchange
                            'v1/stable-coin/quote': 1,
                            'v1/stable_coin/exchange_rate': 1,
                            // ETP
                            'v2/etp/transactions': 5,
                            'v2/etp/transaction': 5,
                            'v2/etp/limit': 1,
                        },
                        'post': {
                            // Account
                            'v1/account/transfer': 1,
                            'v1/futures/transfer': 1, // future transfers
                            'v2/point/transfer': 5,
                            'v2/account/transfer': 1, // swap transfers
                            // Wallet (Deposit and Withdraw)
                            'v1/dw/withdraw/api/create': 1,
                            'v1/dw/withdraw-virtual/{withdraw-id}/cancel': 1,
                            // Sub user management
                            'v2/sub-user/deduct-mode': 1,
                            'v2/sub-user/creation': 1,
                            'v2/sub-user/management': 1,
                            'v2/sub-user/tradable-market': 1,
                            'v2/sub-user/transferability': 1,
                            'v2/sub-user/api-key-generation': 1,
                            'v2/sub-user/api-key-modification': 1,
                            'v2/sub-user/api-key-deletion': 1,
                            'v1/subuser/transfer': 10,
                            'v1/trust/user/active/credit': 10,
                            // Trading
                            'v1/order/orders/place': 0.2,
                            'v1/order/batch-orders': 0.4,
                            'v1/order/auto/place': 0.2,
                            'v1/order/orders/{order-id}/submitcancel': 0.2,
                            'v1/order/orders/submitCancelClientOrder': 0.2,
                            'v1/order/orders/batchCancelOpenOrders': 0.4,
                            'v1/order/orders/batchcancel': 0.4,
                            'v2/algo-orders/cancel-all-after': 1,
                            // Conditional Order
                            'v2/algo-orders': 1,
                            'v2/algo-orders/cancellation': 1,
                            // Margin Loan (Cross/Isolated)
                            'v2/account/repayment': 5,
                            'v1/dw/transfer-in/margin': 10,
                            'v1/dw/transfer-out/margin': 10,
                            'v1/margin/orders': 10,
                            'v1/margin/orders/{order-id}/repay': 10,
                            'v1/cross-margin/transfer-in': 1,
                            'v1/cross-margin/transfer-out': 1,
                            'v1/cross-margin/orders': 1,
                            'v1/cross-margin/orders/{order-id}/repay': 1,
                            // Stable Coin Exchange
                            'v1/stable-coin/exchange': 1,
                            // ETP
                            'v2/etp/creation': 5,
                            'v2/etp/redemption': 5,
                            'v2/etp/{transactId}/cancel': 10,
                            'v2/etp/batch-cancel': 50,
                        },
                    },
                },
                'contract': {
                    'public': {
                        'get': {
                            'api/v1/timestamp': 1,
                            'heartbeat/': 1, // backslash is not a typo
                            // Future Market Data interface
                            'api/v1/contract_contract_info': 1,
                            'api/v1/contract_index': 1,
                            'api/v1/contract_query_elements': 1,
                            'api/v1/contract_price_limit': 1,
                            'api/v1/contract_open_interest': 1,
                            'api/v1/contract_delivery_price': 1,
                            'market/depth': 1,
                            'market/bbo': 1,
                            'market/history/kline': 1,
                            'index/market/history/mark_price_kline': 1,
                            'market/detail/merged': 1,
                            'market/detail/batch_merged': 1,
                            'v2/market/detail/batch_merged': 1,
                            'market/trade': 1,
                            'market/history/trade': 1,
                            'api/v1/contract_risk_info': 1,
                            'api/v1/contract_insurance_fund': 1,
                            'api/v1/contract_adjustfactor': 1,
                            'api/v1/contract_his_open_interest': 1,
                            'api/v1/contract_ladder_margin': 1,
                            'api/v1/contract_api_state': 1,
                            'api/v1/contract_elite_account_ratio': 1,
                            'api/v1/contract_elite_position_ratio': 1,
                            'api/v1/contract_liquidation_orders': 1,
                            'api/v1/contract_settlement_records': 1,
                            'index/market/history/index': 1,
                            'index/market/history/basis': 1,
                            'api/v1/contract_estimated_settlement_price': 1,
                            'api/v3/contract_liquidation_orders': 1,
                            // Swap Market Data interface
                            'swap-api/v1/swap_contract_info': 1,
                            'swap-api/v1/swap_index': 1,
                            'swap-api/v1/swap_query_elements': 1,
                            'swap-api/v1/swap_price_limit': 1,
                            'swap-api/v1/swap_open_interest': 1,
                            'swap-ex/market/depth': 1,
                            'swap-ex/market/bbo': 1,
                            'swap-ex/market/history/kline': 1,
                            'index/market/history/swap_mark_price_kline': 1,
                            'swap-ex/market/detail/merged': 1,
                            'v2/swap-ex/market/detail/batch_merged': 1,
                            'index/market/history/swap_premium_index_kline': 1,
                            'swap-ex/market/detail/batch_merged': 1,
                            'swap-ex/market/trade': 1,
                            'swap-ex/market/history/trade': 1,
                            'swap-api/v1/swap_risk_info': 1,
                            'swap-api/v1/swap_insurance_fund': 1,
                            'swap-api/v1/swap_adjustfactor': 1,
                            'swap-api/v1/swap_his_open_interest': 1,
                            'swap-api/v1/swap_ladder_margin': 1,
                            'swap-api/v1/swap_api_state': 1,
                            'swap-api/v1/swap_elite_account_ratio': 1,
                            'swap-api/v1/swap_elite_position_ratio': 1,
                            'swap-api/v1/swap_estimated_settlement_price': 1,
                            'swap-api/v1/swap_liquidation_orders': 1,
                            'swap-api/v1/swap_settlement_records': 1,
                            'swap-api/v1/swap_funding_rate': 1,
                            'swap-api/v1/swap_batch_funding_rate': 1,
                            'swap-api/v1/swap_historical_funding_rate': 1,
                            'swap-api/v3/swap_liquidation_orders': 1,
                            'index/market/history/swap_estimated_rate_kline': 1,
                            'index/market/history/swap_basis': 1,
                            // Swap Market Data interface
                            'linear-swap-api/v1/swap_contract_info': 1,
                            'linear-swap-api/v1/swap_index': 1,
                            'linear-swap-api/v1/swap_query_elements': 1,
                            'linear-swap-api/v1/swap_price_limit': 1,
                            'linear-swap-api/v1/swap_open_interest': 1,
                            'linear-swap-ex/market/depth': 1,
                            'linear-swap-ex/market/bbo': 1,
                            'linear-swap-ex/market/history/kline': 1,
                            'index/market/history/linear_swap_mark_price_kline': 1,
                            'linear-swap-ex/market/detail/merged': 1,
                            'linear-swap-ex/market/detail/batch_merged': 1,
                            'v2/linear-swap-ex/market/detail/batch_merged': 1,
                            'linear-swap-ex/market/trade': 1,
                            'linear-swap-ex/market/history/trade': 1,
                            'linear-swap-api/v1/swap_risk_info': 1,
                            'swap-api/v1/linear-swap-api/v1/swap_insurance_fund': 1,
                            'linear-swap-api/v1/swap_adjustfactor': 1,
                            'linear-swap-api/v1/swap_cross_adjustfactor': 1,
                            'linear-swap-api/v1/swap_his_open_interest': 1,
                            'linear-swap-api/v1/swap_ladder_margin': 1,
                            'linear-swap-api/v1/swap_cross_ladder_margin': 1,
                            'linear-swap-api/v1/swap_api_state': 1,
                            'linear-swap-api/v1/swap_cross_transfer_state': 1,
                            'linear-swap-api/v1/swap_cross_trade_state': 1,
                            'linear-swap-api/v1/swap_elite_account_ratio': 1,
                            'linear-swap-api/v1/swap_elite_position_ratio': 1,
                            'linear-swap-api/v1/swap_liquidation_orders': 1,
                            'linear-swap-api/v1/swap_settlement_records': 1,
                            'linear-swap-api/v1/swap_funding_rate': 1,
                            'linear-swap-api/v1/swap_batch_funding_rate': 1,
                            'linear-swap-api/v1/swap_historical_funding_rate': 1,
                            'linear-swap-api/v3/swap_liquidation_orders': 1,
                            'index/market/history/linear_swap_premium_index_kline': 1,
                            'index/market/history/linear_swap_estimated_rate_kline': 1,
                            'index/market/history/linear_swap_basis': 1,
                            'linear-swap-api/v1/swap_estimated_settlement_price': 1,
                        },
                    },
                    'private': {
                        'get': {
                            // Future Account Interface
                            'api/v1/contract_sub_auth_list': 1,
                            'api/v1/contract_api_trading_status': 1,
                            // Swap Account Interface
                            'swap-api/v1/swap_sub_auth_list': 1,
                            'swap-api/v1/swap_api_trading_status': 1,
                            // Swap Account Interface
                            'linear-swap-api/v1/swap_sub_auth_list': 1,
                            'linear-swap-api/v1/swap_api_trading_status': 1,
                            'linear-swap-api/v1/swap_cross_position_side': 1,
                            'linear-swap-api/v1/swap_position_side': 1,
                            'linear-swap-api/v3/unified_account_info': 1,
                            'linear-swap-api/v3/fix_position_margin_change_record': 1,
                            'linear-swap-api/v3/swap_unified_account_type': 1,
                            'linear-swap-api/v3/linear_swap_overview_account_info': 1,
                        },
                        'post': {
                            // Future Account Interface
                            'api/v1/contract_balance_valuation': 1,
                            'api/v1/contract_account_info': 1,
                            'api/v1/contract_position_info': 1,
                            'api/v1/contract_sub_auth': 1,
                            'api/v1/contract_sub_account_list': 1,
                            'api/v1/contract_sub_account_info_list': 1,
                            'api/v1/contract_sub_account_info': 1,
                            'api/v1/contract_sub_position_info': 1,
                            'api/v1/contract_financial_record': 1,
                            'api/v1/contract_financial_record_exact': 1,
                            'api/v1/contract_user_settlement_records': 1,
                            'api/v1/contract_order_limit': 1,
                            'api/v1/contract_fee': 1,
                            'api/v1/contract_transfer_limit': 1,
                            'api/v1/contract_position_limit': 1,
                            'api/v1/contract_account_position_info': 1,
                            'api/v1/contract_master_sub_transfer': 1,
                            'api/v1/contract_master_sub_transfer_record': 1,
                            'api/v1/contract_available_level_rate': 1,
                            'api/v3/contract_financial_record': 1,
                            'api/v3/contract_financial_record_exact': 1,
                            // Future Trade Interface
                            'api/v1/contract-cancel-after': 1,
                            'api/v1/contract_order': 1,
                            'api/v1/contract_batchorder': 1,
                            'api/v1/contract_cancel': 1,
                            'api/v1/contract_cancelall': 1,
                            'api/v1/contract_switch_lever_rate': 1,
                            'api/v1/lightning_close_position': 1,
                            'api/v1/contract_order_info': 1,
                            'api/v1/contract_order_detail': 1,
                            'api/v1/contract_openorders': 1,
                            'api/v1/contract_hisorders': 1,
                            'api/v1/contract_hisorders_exact': 1,
                            'api/v1/contract_matchresults': 1,
                            'api/v1/contract_matchresults_exact': 1,
                            'api/v3/contract_hisorders': 1,
                            'api/v3/contract_hisorders_exact': 1,
                            'api/v3/contract_matchresults': 1,
                            'api/v3/contract_matchresults_exact': 1,
                            // Contract Strategy Order Interface
                            'api/v1/contract_trigger_order': 1,
                            'api/v1/contract_trigger_cancel': 1,
                            'api/v1/contract_trigger_cancelall': 1,
                            'api/v1/contract_trigger_openorders': 1,
                            'api/v1/contract_trigger_hisorders': 1,
                            'api/v1/contract_tpsl_order': 1,
                            'api/v1/contract_tpsl_cancel': 1,
                            'api/v1/contract_tpsl_cancelall': 1,
                            'api/v1/contract_tpsl_openorders': 1,
                            'api/v1/contract_tpsl_hisorders': 1,
                            'api/v1/contract_relation_tpsl_order': 1,
                            'api/v1/contract_track_order': 1,
                            'api/v1/contract_track_cancel': 1,
                            'api/v1/contract_track_cancelall': 1,
                            'api/v1/contract_track_openorders': 1,
                            'api/v1/contract_track_hisorders': 1,
                            // Swap Account Interface
                            'swap-api/v1/swap_balance_valuation': 1,
                            'swap-api/v1/swap_account_info': 1,
                            'swap-api/v1/swap_position_info': 1,
                            'swap-api/v1/swap_account_position_info': 1,
                            'swap-api/v1/swap_sub_auth': 1,
                            'swap-api/v1/swap_sub_account_list': 1,
                            'swap-api/v1/swap_sub_account_info_list': 1,
                            'swap-api/v1/swap_sub_account_info': 1,
                            'swap-api/v1/swap_sub_position_info': 1,
                            'swap-api/v1/swap_financial_record': 1,
                            'swap-api/v1/swap_financial_record_exact': 1,
                            'swap-api/v1/swap_user_settlement_records': 1,
                            'swap-api/v1/swap_available_level_rate': 1,
                            'swap-api/v1/swap_order_limit': 1,
                            'swap-api/v1/swap_fee': 1,
                            'swap-api/v1/swap_transfer_limit': 1,
                            'swap-api/v1/swap_position_limit': 1,
                            'swap-api/v1/swap_master_sub_transfer': 1,
                            'swap-api/v1/swap_master_sub_transfer_record': 1,
                            'swap-api/v3/swap_financial_record': 1,
                            'swap-api/v3/swap_financial_record_exact': 1,
                            // Swap Trade Interface
                            'swap-api/v1/swap-cancel-after': 1,
                            'swap-api/v1/swap_order': 1,
                            'swap-api/v1/swap_batchorder': 1,
                            'swap-api/v1/swap_cancel': 1,
                            'swap-api/v1/swap_cancelall': 1,
                            'swap-api/v1/swap_lightning_close_position': 1,
                            'swap-api/v1/swap_switch_lever_rate': 1,
                            'swap-api/v1/swap_order_info': 1,
                            'swap-api/v1/swap_order_detail': 1,
                            'swap-api/v1/swap_openorders': 1,
                            'swap-api/v1/swap_hisorders': 1,
                            'swap-api/v1/swap_hisorders_exact': 1,
                            'swap-api/v1/swap_matchresults': 1,
                            'swap-api/v1/swap_matchresults_exact': 1,
                            'swap-api/v3/swap_matchresults': 1,
                            'swap-api/v3/swap_matchresults_exact': 1,
                            'swap-api/v3/swap_hisorders': 1,
                            'swap-api/v3/swap_hisorders_exact': 1,
                            // Swap Strategy Order Interface
                            'swap-api/v1/swap_trigger_order': 1,
                            'swap-api/v1/swap_trigger_cancel': 1,
                            'swap-api/v1/swap_trigger_cancelall': 1,
                            'swap-api/v1/swap_trigger_openorders': 1,
                            'swap-api/v1/swap_trigger_hisorders': 1,
                            'swap-api/v1/swap_tpsl_order': 1,
                            'swap-api/v1/swap_tpsl_cancel': 1,
                            'swap-api/v1/swap_tpsl_cancelall': 1,
                            'swap-api/v1/swap_tpsl_openorders': 1,
                            'swap-api/v1/swap_tpsl_hisorders': 1,
                            'swap-api/v1/swap_relation_tpsl_order': 1,
                            'swap-api/v1/swap_track_order': 1,
                            'swap-api/v1/swap_track_cancel': 1,
                            'swap-api/v1/swap_track_cancelall': 1,
                            'swap-api/v1/swap_track_openorders': 1,
                            'swap-api/v1/swap_track_hisorders': 1,
                            // Swap Account Interface
                            'linear-swap-api/v1/swap_lever_position_limit': 1,
                            'linear-swap-api/v1/swap_cross_lever_position_limit': 1,
                            'linear-swap-api/v1/swap_balance_valuation': 1,
                            'linear-swap-api/v1/swap_account_info': 1,
                            'linear-swap-api/v1/swap_cross_account_info': 1,
                            'linear-swap-api/v1/swap_position_info': 1,
                            'linear-swap-api/v1/swap_cross_position_info': 1,
                            'linear-swap-api/v1/swap_account_position_info': 1,
                            'linear-swap-api/v1/swap_cross_account_position_info': 1,
                            'linear-swap-api/v1/swap_sub_auth': 1,
                            'linear-swap-api/v1/swap_sub_account_list': 1,
                            'linear-swap-api/v1/swap_cross_sub_account_list': 1,
                            'linear-swap-api/v1/swap_sub_account_info_list': 1,
                            'linear-swap-api/v1/swap_cross_sub_account_info_list': 1,
                            'linear-swap-api/v1/swap_sub_account_info': 1,
                            'linear-swap-api/v1/swap_cross_sub_account_info': 1,
                            'linear-swap-api/v1/swap_sub_position_info': 1,
                            'linear-swap-api/v1/swap_cross_sub_position_info': 1,
                            'linear-swap-api/v1/swap_financial_record': 1,
                            'linear-swap-api/v1/swap_financial_record_exact': 1,
                            'linear-swap-api/v1/swap_user_settlement_records': 1,
                            'linear-swap-api/v1/swap_cross_user_settlement_records': 1,
                            'linear-swap-api/v1/swap_available_level_rate': 1,
                            'linear-swap-api/v1/swap_cross_available_level_rate': 1,
                            'linear-swap-api/v1/swap_order_limit': 1,
                            'linear-swap-api/v1/swap_fee': 1,
                            'linear-swap-api/v1/swap_transfer_limit': 1,
                            'linear-swap-api/v1/swap_cross_transfer_limit': 1,
                            'linear-swap-api/v1/swap_position_limit': 1,
                            'linear-swap-api/v1/swap_cross_position_limit': 1,
                            'linear-swap-api/v1/swap_master_sub_transfer': 1,
                            'linear-swap-api/v1/swap_master_sub_transfer_record': 1,
                            'linear-swap-api/v1/swap_transfer_inner': 1,
                            'linear-swap-api/v3/swap_financial_record': 1,
                            'linear-swap-api/v3/swap_financial_record_exact': 1,
                            // Swap Trade Interface
                            'linear-swap-api/v1/swap_order': 1,
                            'linear-swap-api/v1/swap_cross_order': 1,
                            'linear-swap-api/v1/swap_batchorder': 1,
                            'linear-swap-api/v1/swap_cross_batchorder': 1,
                            'linear-swap-api/v1/swap_cancel': 1,
                            'linear-swap-api/v1/swap_cross_cancel': 1,
                            'linear-swap-api/v1/swap_cancelall': 1,
                            'linear-swap-api/v1/swap_cross_cancelall': 1,
                            'linear-swap-api/v1/swap_switch_lever_rate': 1,
                            'linear-swap-api/v1/swap_cross_switch_lever_rate': 1,
                            'linear-swap-api/v1/swap_lightning_close_position': 1,
                            'linear-swap-api/v1/swap_cross_lightning_close_position': 1,
                            'linear-swap-api/v1/swap_order_info': 1,
                            'linear-swap-api/v1/swap_cross_order_info': 1,
                            'linear-swap-api/v1/swap_order_detail': 1,
                            'linear-swap-api/v1/swap_cross_order_detail': 1,
                            'linear-swap-api/v1/swap_openorders': 1,
                            'linear-swap-api/v1/swap_cross_openorders': 1,
                            'linear-swap-api/v1/swap_hisorders': 1,
                            'linear-swap-api/v1/swap_cross_hisorders': 1,
                            'linear-swap-api/v1/swap_hisorders_exact': 1,
                            'linear-swap-api/v1/swap_cross_hisorders_exact': 1,
                            'linear-swap-api/v1/swap_matchresults': 1,
                            'linear-swap-api/v1/swap_cross_matchresults': 1,
                            'linear-swap-api/v1/swap_matchresults_exact': 1,
                            'linear-swap-api/v1/swap_cross_matchresults_exact': 1,
                            'linear-swap-api/v1/linear-cancel-after': 1,
                            'linear-swap-api/v1/swap_switch_position_mode': 1,
                            'linear-swap-api/v1/swap_cross_switch_position_mode': 1,
                            'linear-swap-api/v3/swap_matchresults': 1,
                            'linear-swap-api/v3/swap_cross_matchresults': 1,
                            'linear-swap-api/v3/swap_matchresults_exact': 1,
                            'linear-swap-api/v3/swap_cross_matchresults_exact': 1,
                            'linear-swap-api/v3/swap_hisorders': 1,
                            'linear-swap-api/v3/swap_cross_hisorders': 1,
                            'linear-swap-api/v3/swap_hisorders_exact': 1,
                            'linear-swap-api/v3/swap_cross_hisorders_exact': 1,
                            'linear-swap-api/v3/fix_position_margin_change': 1,
                            'linear-swap-api/v3/swap_switch_account_type': 1,
                            'linear-swap-api/v3/linear_swap_fee_switch': 1,
                            // Swap Strategy Order Interface
                            'linear-swap-api/v1/swap_trigger_order': 1,
                            'linear-swap-api/v1/swap_cross_trigger_order': 1,
                            'linear-swap-api/v1/swap_trigger_cancel': 1,
                            'linear-swap-api/v1/swap_cross_trigger_cancel': 1,
                            'linear-swap-api/v1/swap_trigger_cancelall': 1,
                            'linear-swap-api/v1/swap_cross_trigger_cancelall': 1,
                            'linear-swap-api/v1/swap_trigger_openorders': 1,
                            'linear-swap-api/v1/swap_cross_trigger_openorders': 1,
                            'linear-swap-api/v1/swap_trigger_hisorders': 1,
                            'linear-swap-api/v1/swap_cross_trigger_hisorders': 1,
                            'linear-swap-api/v1/swap_tpsl_order': 1,
                            'linear-swap-api/v1/swap_cross_tpsl_order': 1,
                            'linear-swap-api/v1/swap_tpsl_cancel': 1,
                            'linear-swap-api/v1/swap_cross_tpsl_cancel': 1,
                            'linear-swap-api/v1/swap_tpsl_cancelall': 1,
                            'linear-swap-api/v1/swap_cross_tpsl_cancelall': 1,
                            'linear-swap-api/v1/swap_tpsl_openorders': 1,
                            'linear-swap-api/v1/swap_cross_tpsl_openorders': 1,
                            'linear-swap-api/v1/swap_tpsl_hisorders': 1,
                            'linear-swap-api/v1/swap_cross_tpsl_hisorders': 1,
                            'linear-swap-api/v1/swap_relation_tpsl_order': 1,
                            'linear-swap-api/v1/swap_cross_relation_tpsl_order': 1,
                            'linear-swap-api/v1/swap_track_order': 1,
                            'linear-swap-api/v1/swap_cross_track_order': 1,
                            'linear-swap-api/v1/swap_track_cancel': 1,
                            'linear-swap-api/v1/swap_cross_track_cancel': 1,
                            'linear-swap-api/v1/swap_track_cancelall': 1,
                            'linear-swap-api/v1/swap_cross_track_cancelall': 1,
                            'linear-swap-api/v1/swap_track_openorders': 1,
                            'linear-swap-api/v1/swap_cross_track_openorders': 1,
                            'linear-swap-api/v1/swap_track_hisorders': 1,
                            'linear-swap-api/v1/swap_cross_track_hisorders': 1,
                        },
                    },
                },
            },
            'fees': {
                'trading': {
                    'feeSide': 'get',
                    'tierBased': false,
                    'percentage': true,
                    'maker': this.parseNumber ('0.002'),
                    'taker': this.parseNumber ('0.002'),
                },
            },
            'exceptions': {
                'broad': {
                    'contract is restricted of closing positions on API.  Please contact customer service': OnMaintenance,
                    'maintain': OnMaintenance,
                    'API key has no permission': PermissionDenied, // {"status":"error","err-code":"api-signature-not-valid","err-msg":"Signature not valid: API key has no permission [API Key没有权限]","data":null}
                },
                'exact': {
                    // err-code
                    '403': AuthenticationError,  // {"status":"error","err_code":403,"err_msg":"Incorrect Access key [Access key错误]","ts":1652774224344}
                    '1010': AccountNotEnabled, // {"status":"error","err_code":1010,"err_msg":"Account doesnt exist.","ts":1648137970490}
                    '1003': AuthenticationError, // {code: '1003', message: 'invalid signature'}
                    '1013': BadSymbol, // {"status":"error","err_code":1013,"err_msg":"This contract symbol doesnt exist.","ts":1640550459583}
                    '1017': OrderNotFound, // {"status":"error","err_code":1017,"err_msg":"Order doesnt exist.","ts":1640550859242}
                    '1034': InvalidOrder, // {"status":"error","err_code":1034,"err_msg":"Incorrect field of order price type.","ts":1643802870182}
                    '1036': InvalidOrder, // {"status":"error","err_code":1036,"err_msg":"Incorrect field of open long form.","ts":1643802518986}
                    '1039': InvalidOrder, // {"status":"error","err_code":1039,"err_msg":"Buy price must be lower than 39270.9USDT. Sell price must exceed 37731USDT.","ts":1643802374403}
                    '1041': InvalidOrder, // {"status":"error","err_code":1041,"err_msg":"The order amount exceeds the limit (170000Cont), please modify and order again.","ts":1643802784940}
                    '1047': InsufficientFunds, // {"status":"error","err_code":1047,"err_msg":"Insufficient margin available.","ts":1643802672652}
                    '1048': InsufficientFunds,  // {"status":"error","err_code":1048,"err_msg":"Insufficient close amount available.","ts":1652772408864}
                    '1061': OrderNotFound, // {"status":"ok","data":{"errors":[{"order_id":"1349442392365359104","err_code":1061,"err_msg":"The order does not exist."}],"successes":""},"ts":1741773744526}
                    '1051': InvalidOrder, // {"status":"error","err_code":1051,"err_msg":"No orders to cancel.","ts":1652552125876}
                    '1066': BadSymbol, // {"status":"error","err_code":1066,"err_msg":"The symbol field cannot be empty. Please re-enter.","ts":1640550819147}
                    '1067': InvalidOrder, // {"status":"error","err_code":1067,"err_msg":"The client_order_id field is invalid. Please re-enter.","ts":1643802119413}
                    '1094': InvalidOrder, // {"status":"error","err_code":1094,"err_msg":"The leverage cannot be empty, please switch the leverage or contact customer service","ts":1640496946243}
                    '1220': AccountNotEnabled, // {"status":"error","err_code":1220,"err_msg":"You don’t have access permission as you have not opened contracts trading.","ts":1645096660718}
                    '1303': BadRequest, // {"code":1303,"data":null,"message":"Each transfer-out cannot be less than 5USDT.","success":false,"print-log":true}
                    '1461': InvalidOrder, // {"status":"error","err_code":1461,"err_msg":"Current positions have triggered position limits (5000USDT). Please modify.","ts":1652554651234}
                    '4007': BadRequest, // {"code":"4007","msg":"Unified account special interface, non - one account is not available","data":null,"ts":"1698413427651"}'
                    'bad-request': BadRequest,
                    'validation-format-error': BadRequest, // {"status":"error","err-code":"validation-format-error","err-msg":"Format Error: order-id.","data":null}
                    'validation-constraints-required': BadRequest, // {"status":"error","err-code":"validation-constraints-required","err-msg":"Field is missing: client-order-id.","data":null}
                    'base-date-limit-error': BadRequest, // {"status":"error","err-code":"base-date-limit-error","err-msg":"date less than system limit","data":null}
                    'api-not-support-temp-addr': PermissionDenied, // {"status":"error","err-code":"api-not-support-temp-addr","err-msg":"API withdrawal does not support temporary addresses","data":null}
                    'timeout': RequestTimeout, // {"ts":1571653730865,"status":"error","err-code":"timeout","err-msg":"Request Timeout"}
                    'gateway-internal-error': ExchangeNotAvailable, // {"status":"error","err-code":"gateway-internal-error","err-msg":"Failed to load data. Try again later.","data":null}
                    'account-frozen-balance-insufficient-error': InsufficientFunds, // {"status":"error","err-code":"account-frozen-balance-insufficient-error","err-msg":"trade account balance is not enough, left: `0.0027`","data":null}
                    'invalid-amount': InvalidOrder, // eg "Paramemter `amount` is invalid."
                    'order-limitorder-amount-min-error': InvalidOrder, // limit order amount error, min: `0.001`
                    'order-limitorder-amount-max-error': InvalidOrder, // market order amount error, max: `1000000`
                    'order-marketorder-amount-min-error': InvalidOrder, // market order amount error, min: `0.01`
                    'order-limitorder-price-min-error': InvalidOrder, // limit order price error
                    'order-limitorder-price-max-error': InvalidOrder, // limit order price error
                    'order-stop-order-hit-trigger': InvalidOrder, // {"status":"error","err-code":"order-stop-order-hit-trigger","err-msg":"Orders that are triggered immediately are not supported.","data":null}
                    'order-value-min-error': InvalidOrder, // {"status":"error","err-code":"order-value-min-error","err-msg":"Order total cannot be lower than: 1 USDT","data":null}
                    'order-invalid-price': InvalidOrder, // {"status":"error","err-code":"order-invalid-price","err-msg":"invalid price","data":null}
                    'order-holding-limit-failed': InvalidOrder, // {"status":"error","err-code":"order-holding-limit-failed","err-msg":"Order failed, exceeded the holding limit of this currency","data":null}
                    'order-orderprice-precision-error': InvalidOrder, // {"status":"error","err-code":"order-orderprice-precision-error","err-msg":"order price precision error, scale: `4`","data":null}
                    'order-etp-nav-price-max-error': InvalidOrder, // {"status":"error","err-code":"order-etp-nav-price-max-error","err-msg":"Order price cannot be higher than 5% of NAV","data":null}
                    'order-orderstate-error': OrderNotFound, // canceling an already canceled order
                    'order-queryorder-invalid': OrderNotFound, // querying a non-existent order
                    'order-update-error': ExchangeNotAvailable, // undocumented error
                    'api-signature-check-failed': AuthenticationError,
                    'api-signature-not-valid': AuthenticationError, // {"status":"error","err-code":"api-signature-not-valid","err-msg":"Signature not valid: Incorrect Access key [Access key错误]","data":null}
                    'base-record-invalid': OrderNotFound, // https://github.com/ccxt/ccxt/issues/5750
                    'base-symbol-trade-disabled': BadSymbol, // {"status":"error","err-code":"base-symbol-trade-disabled","err-msg":"Trading is disabled for this symbol","data":null}
                    'base-symbol-error': BadSymbol, // {"status":"error","err-code":"base-symbol-error","err-msg":"The symbol is invalid","data":null}
                    'system-maintenance': OnMaintenance, // {"status": "error", "err-code": "system-maintenance", "err-msg": "System is in maintenance!", "data": null}
                    'base-request-exceed-frequency-limit': RateLimitExceeded, // {"status":"error","err-code":"base-request-exceed-frequency-limit","err-msg":"Frequency of requests has exceeded the limit, please try again later","data":null}
                    // err-msg
                    'invalid symbol': BadSymbol, // {"ts":1568813334794,"status":"error","err-code":"invalid-parameter","err-msg":"invalid symbol"}
                    'symbol trade not open now': BadSymbol, // {"ts":1576210479343,"status":"error","err-code":"invalid-parameter","err-msg":"symbol trade not open now"}
                    'require-symbol': BadSymbol, // {"status":"error","err-code":"require-symbol","err-msg":"Parameter `symbol` is required.","data":null},
                    'invalid-address': BadRequest, // {"status":"error","err-code":"invalid-address","err-msg":"Invalid address.","data":null},
                    'base-currency-chain-error': BadRequest, // {"status":"error","err-code":"base-currency-chain-error","err-msg":"The current currency chain does not exist","data":null},
                    'dw-insufficient-balance': InsufficientFunds, // {"status":"error","err-code":"dw-insufficient-balance","err-msg":"Insufficient balance. You can only transfer `12.3456` at most.","data":null}
                    'base-withdraw-fee-error': BadRequest, // {"status":"error","err-code":"base-withdraw-fee-error","err-msg":"withdrawal fee is not within limits","data":null}
                    'dw-withdraw-min-limit': BadRequest, // {"status":"error","err-code":"dw-withdraw-min-limit","err-msg":"The withdrawal amount is less than the minimum limit.","data":null}
                    'request limit': RateLimitExceeded, // {"ts":1687004814731,"status":"error","err-code":"invalid-parameter","err-msg":"request limit"}
                },
            },
            'precisionMode': TICK_SIZE,
            'options': {
                'include_OS_certificates': false, // temporarily leave this, remove in future
                'fetchMarkets': {
                    'types': {
                        'spot': true,
                        'linear': true,
                        'inverse': true,
                    },
                },
                'timeDifference': 0, // the difference between system clock and exchange clock
                'adjustForTimeDifference': false, // controls the adjustment logic upon instantiation
                'fetchOHLCV': {
                    'useHistoricalEndpointForSpot': true,
                },
                'withdraw': {
                    'includeFee': false,
                },
                'defaultType': 'spot', // spot, future, swap
                'defaultSubType': 'linear', // inverse, linear
                'defaultNetwork': 'ERC20',
                'defaultNetworks': {
                    'ETH': 'ERC20',
                    'BTC': 'BTC',
                    'USDT': 'TRC20',
                },
                'networks': {
                    // by displaynames
                    'TRC20': 'TRX', // TRON for mainnet
                    'BTC': 'BTC',
                    'ERC20': 'ETH', // ETH for mainnet
                    'SOL': 'SOLANA',
                    'HRC20': 'HECO',
                    'BEP20': 'BSC',
                    'XMR': 'XMR',
                    'LTC': 'LTC',
                    'XRP': 'XRP',
                    'XLM': 'XLM',
                    'CRONOS': 'CRO',
                    'CRO': 'CRO',
                    'GLMR': 'GLMR',
                    'POLYGON': 'MATIC',
                    'MATIC': 'MATIC',
                    'BTT': 'BTT',
                    'CUBE': 'CUBE',
                    'IOST': 'IOST',
                    'NEO': 'NEO',
                    'KLAY': 'KLAY',
                    'EOS': 'EOS',
                    'THETA': 'THETA',
                    'NAS': 'NAS',
                    'NULS': 'NULS',
                    'QTUM': 'QTUM',
                    'FTM': 'FTM',
                    'CELO': 'CELO',
                    'DOGE': 'DOGE',
                    'DOGECHAIN': 'DOGECHAIN',
                    'NEAR': 'NEAR',
                    'STEP': 'STEP',
                    'BITCI': 'BITCI',
                    'CARDANO': 'ADA',
                    'ADA': 'ADA',
                    'ETC': 'ETC',
                    'LUK': 'LUK',
                    'MINEPLEX': 'MINEPLEX',
                    'DASH': 'DASH',
                    'ZEC': 'ZEC',
                    'IOTA': 'IOTA',
                    'NEON3': 'NEON3',
                    'XEM': 'XEM',
                    'HC': 'HC',
                    'LSK': 'LSK',
                    'DCR': 'DCR',
                    'BTG': 'BTG',
                    'STEEM': 'STEEM',
                    'BTS': 'BTS',
                    'ICX': 'ICX',
                    'WAVES': 'WAVES',
                    'CMT': 'CMT',
                    'BTM': 'BTM',
                    'VET': 'VET',
                    'XZC': 'XZC',
                    'ACT': 'ACT',
                    'SMT': 'SMT',
                    'BCD': 'BCD',
                    'WAX': 'WAX1',
                    'WICC': 'WICC',
                    'ELF': 'ELF',
                    'ZIL': 'ZIL',
                    'ELA': 'ELA',
                    'BCX': 'BCX',
                    'SBTC': 'SBTC',
                    'BIFI': 'BIFI',
                    'CTXC': 'CTXC',
                    'WAN': 'WAN',
                    'POLYX': 'POLYX',
                    'PAI': 'PAI',
                    'WTC': 'WTC',
                    'DGB': 'DGB',
                    'XVG': 'XVG',
                    'AAC': 'AAC',
                    'AE': 'AE',
                    'SEELE': 'SEELE',
                    'BCV': 'BCV',
                    'GRS': 'GRS',
                    'ARDR': 'ARDR',
                    'NANO': 'NANO',
                    'ZEN': 'ZEN',
                    'RBTC': 'RBTC',
                    'BSV': 'BSV',
                    'GAS': 'GAS',
                    'XTZ': 'XTZ',
                    'LAMB': 'LAMB',
                    'CVNT1': 'CVNT1',
                    'DOCK': 'DOCK',
                    'SC': 'SC',
                    'KMD': 'KMD',
                    'ETN': 'ETN',
                    'TOP': 'TOP',
                    'IRIS': 'IRIS',
                    'UGAS': 'UGAS',
                    'TT': 'TT',
                    'NEWTON': 'NEWTON',
                    'VSYS': 'VSYS',
                    'FSN': 'FSN',
                    'BHD': 'BHD',
                    'ONE': 'ONE',
                    'EM': 'EM',
                    'CKB': 'CKB',
                    'EOSS': 'EOSS',
                    'HIVE': 'HIVE',
                    'RVN': 'RVN',
                    'DOT': 'DOT',
                    'KSM': 'KSM',
                    'BAND': 'BAND',
                    'OEP4': 'OEP4',
                    'NBS': 'NBS',
                    'FIS': 'FIS',
                    'AR': 'AR',
                    'HBAR': 'HBAR',
                    'FIL': 'FIL',
                    'MASS': 'MASS',
                    'KAVA': 'KAVA',
                    'XYM': 'XYM',
                    'ENJ': 'ENJ',
                    'CRUST': 'CRUST',
                    'ICP': 'ICP',
                    'CSPR': 'CSPR',
                    'FLOW': 'FLOW',
                    'IOTX': 'IOTX',
                    'LAT': 'LAT',
                    'APT': 'APT',
                    'XCH': 'XCH',
                    'MINA': 'MINA',
                    'XEC': 'ECASH',
                    'XPRT': 'XPRT',
                    'CCA': 'ACA',
                    'AOTI': 'COTI',
                    'AKT': 'AKT',
                    'ARS': 'ARS',
                    'ASTR': 'ASTR',
                    'AZERO': 'AZERO',
                    'BLD': 'BLD',
                    'BRISE': 'BRISE',
                    'CORE': 'CORE',
                    'DESO': 'DESO',
                    'DFI': 'DFI',
                    'EGLD': 'EGLD',
                    'ERG': 'ERG',
                    'ETHF': 'ETHFAIR',
                    'ETHW': 'ETHW',
                    'EVMOS': 'EVMOS',
                    'FIO': 'FIO',
                    'FLR': 'FLR',
                    'FINSCHIA': 'FINSCHIA',
                    'KMA': 'KMA',
                    'KYVE': 'KYVE',
                    'MEV': 'MEV',
                    'MOVR': 'MOVR',
                    'NODL': 'NODL',
                    'OAS': 'OAS',
                    'OSMO': 'OSMO',
                    'PAYCOIN': 'PAYCOIN',
                    'POKT': 'POKT',
                    'PYG': 'PYG',
                    'REI': 'REI',
                    'SCRT': 'SCRT',
                    'SDN': 'SDN',
                    'SEI': 'SEI',
                    'SGB': 'SGB',
                    'SUI': 'SUI',
                    'SXP': 'SOLAR',
                    'SYS': 'SYS',
                    'TENET': 'TENET',
                    'TON': 'TON',
                    'UNQ': 'UNQ',
                    'UYU': 'UYU',
                    'WEMIX': 'WEMIX',
                    'XDC': 'XDC',
                    'XPLA': 'XPLA',
                    // todo: below
                    // 'LUNC': 'LUNC',
                    // 'TERRA': 'TERRA', // tbd
                    // 'LUNA': 'LUNA', tbd
                    // 'FCT2': 'FCT2',
                    // FIL-0X ?
                    // 'COSMOS': 'ATOM1',
                    // 'ATOM': 'ATOM1',
                    // 'CRO': 'CRO',
                    // 'OP': [ 'OPTIMISM', 'OPTIMISMETH' ]
                    // 'ARB': ['ARB', 'ARBITRUMETH']
                    // 'CHZ': [ 'CHZ', 'CZH' ],
                    // todo: AVAXCCHAIN CCHAIN AVAX
                    // 'ALGO': ['ALGO', 'ALGOUSDT']
                    // 'ONT': [ 'ONT', 'ONTOLOGY' ],
                    // 'BCC': 'BCC', BCH's somewhat chain
                    // 'DBC1': 'DBC1',
                },
                // https://github.com/ccxt/ccxt/issues/5376
                'fetchOrdersByStatesMethod': 'spot_private_get_v1_order_orders', // 'spot_private_get_v1_order_history' // https://github.com/ccxt/ccxt/pull/5392
                'createMarketBuyOrderRequiresPrice': true,
                'language': 'en-US',
                'broker': {
                    'id': 'AA03022abc',
                },
                'accountsByType': {
                    'spot': 'pro',
                    'funding': 'pro',
                    'future': 'futures',
                },
                'accountsById': {
                    'spot': 'spot',
                    'margin': 'margin',
                    'otc': 'otc',
                    'point': 'point',
                    'super-margin': 'super-margin',
                    'investment': 'investment',
                    'borrow': 'borrow',
                    'grid-trading': 'grid-trading',
                    'deposit-earning': 'deposit-earning',
                    'otc-options': 'otc-options',
                },
                'typesByAccount': {
                    'pro': 'spot',
                    'futures': 'future',
                },
                'spot': {
                    'stopOrderTypes': {
                        'stop-limit': true,
                        'buy-stop-limit': true,
                        'sell-stop-limit': true,
                        'stop-limit-fok': true,
                        'buy-stop-limit-fok': true,
                        'sell-stop-limit-fok': true,
                    },
                    'limitOrderTypes': {
                        'limit': true,
                        'buy-limit': true,
                        'sell-limit': true,
                        'ioc': true,
                        'buy-ioc': true,
                        'sell-ioc': true,
                        'limit-maker': true,
                        'buy-limit-maker': true,
                        'sell-limit-maker': true,
                        'stop-limit': true,
                        'buy-stop-limit': true,
                        'sell-stop-limit': true,
                        'limit-fok': true,
                        'buy-limit-fok': true,
                        'sell-limit-fok': true,
                        'stop-limit-fok': true,
                        'buy-stop-limit-fok': true,
                        'sell-stop-limit-fok': true,
                    },
                },
            },
            'commonCurrencies': {
                // https://github.com/ccxt/ccxt/issues/6081
                // https://github.com/ccxt/ccxt/issues/3365
                // https://github.com/ccxt/ccxt/issues/2873
                'NGL': 'GFNGL',
                'GET': 'THEMIS', // conflict with GET (Guaranteed Entrance Token, GET Protocol)
                'GTC': 'GAMECOM', // conflict with Gitcoin and Gastrocoin
                'HIT': 'HITCHAIN',
                // https://github.com/ccxt/ccxt/issues/7399
                // https://coinmarketcap.com/currencies/pnetwork/
                // https://coinmarketcap.com/currencies/penta/markets/
                // https://en.cryptonomist.ch/blog/eidoo/the-edo-to-pnt-upgrade-what-you-need-to-know-updated/
                'PNT': 'PENTA',
                'SBTC': 'SUPERBITCOIN',
                'SOUL': 'SOULSAVER',
                'BIFI': 'BITCOINFILE', // conflict with Beefy.Finance https://github.com/ccxt/ccxt/issues/8706
                'FUD': 'FTX Users Debt',
            },
            'features': {
                'spot': {
                    'sandbox': true,
                    'createOrder': {
                        'marginMode': true,
                        'triggerPrice': true,
                        'triggerDirection': true,
                        'triggerPriceType': undefined,
                        'stopLossPrice': false, // todo: add support by triggerprice
                        'takeProfitPrice': false,
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': false,
                        },
                        'hedged': false,
                        'trailing': false,
                        'iceberg': false,
                        'selfTradePrevention': true, // todo implement
                        'leverage': true, // todo implement
                        'marketBuyByCost': true,
                        'marketBuyRequiresPrice': true,
                    },
                    'createOrders': {
                        'max': 10,
                    },
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 500,
                        'daysBack': 120,
                        'untilDays': 2,
                        'symbolRequired': false,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'trigger': true,
                        'trailing': false,
                        'limit': 500,
                        'symbolRequired': false,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'trigger': true,
                        'trailing': false,
                        'limit': 500,
                        'untilDays': 2,
                        'daysBack': 180,
                        'symbolRequired': false,
                    },
                    'fetchClosedOrders': {
                        'marginMode': false,
                        'trigger': true,
                        'trailing': false,
                        'untilDays': 2,
                        'limit': 500,
                        'daysBack': 180,
                        'daysBackCanceled': 1 / 12,
                        'symbolRequired': false,
                    },
                    'fetchOHLCV': {
                        'limit': 1000, // 2000 for non-historical
                    },
                },
                'forDerivatives': {
                    'extends': 'spot',
                    'createOrder': {
                        'stopLossPrice': true,
                        'takeProfitPrice': true,
                        'trailing': true,
                        'hedged': true,
                        // 'leverage': true, // todo
                    },
                    'createOrders': {
                        'max': 25,
                    },
                    'fetchOrder': {
                        'marginMode': true,
                    },
                    'fetchOpenOrders': {
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                        'limit': 50,
                    },
                    'fetchOrders': {
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                        'limit': 50,
                        'daysBack': 90,
                    },
                    'fetchClosedOrders': {
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                        'untilDays': 2,
                        'limit': 50,
                        'daysBack': 90,
                        'daysBackCanceled': 1 / 12,
                    },
                    'fetchOHLCV': {
                        'limit': 2000,
                    },
                },
                'swap': {
                    'linear': {
                        'extends': 'forDerivatives',
                    },
                    'inverse': {
                        'extends': 'forDerivatives',
                    },
                },
                'future': {
                    'linear': {
                        'extends': 'forDerivatives',
                    },
                    'inverse': {
                        'extends': 'forDerivatives',
                    },
                },
            },
        });
    }

    /**
     * @method
     * @name htx#fetchStatus
     * @description the latest known information on the availability of the exchange API
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-system-status
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-system-status
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-system-status
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#get-system-status
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#query-whether-the-system-is-available  // contractPublicGetHeartbeat
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [status structure]{@link https://docs.ccxt.com/#/?id=exchange-status-structure}
     */
    async fetchStatus (params = {}) {
        await this.loadMarkets ();
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchStatus', undefined, params);
        const enabledForContracts = this.handleOption ('fetchStatus', 'enableForContracts', false); // temp fix for: https://status-linear-swap.huobigroup.com/api/v2/summary.json
        let response = undefined;
        if (marketType !== 'spot' && enabledForContracts) {
            const subType = this.safeString (params, 'subType', this.options['defaultSubType']);
            if (marketType === 'swap') {
                if (subType === 'linear') {
                    response = await this.statusPublicSwapLinearGetApiV2SummaryJson ();
                } else if (subType === 'inverse') {
                    response = await this.statusPublicSwapInverseGetApiV2SummaryJson ();
                }
            } else if (marketType === 'future') {
                if (subType === 'linear') {
                    response = await this.statusPublicFutureLinearGetApiV2SummaryJson ();
                } else if (subType === 'inverse') {
                    response = await this.statusPublicFutureInverseGetApiV2SummaryJson ();
                }
            } else if (marketType === 'contract') {
                response = await this.contractPublicGetHeartbeat ();
            }
        } else if (marketType === 'spot') {
            response = await this.statusPublicSpotGetApiV2SummaryJson ();
        }
        //
        // statusPublicSpotGetApiV2SummaryJson, statusPublicSwapInverseGetApiV2SummaryJson, statusPublicFutureLinearGetApiV2SummaryJson, statusPublicFutureInverseGetApiV2SummaryJson
        //
        //      {
        //          "page": {
        //              "id":"mn7l2lw8pz4p",
        //              "name":"Huobi Futures-USDT-margined Swaps",
        //              "url":"https://status-linear-swap.huobigroup.com",
        //              "time_zone":"Asia/Singapore",
        //              "updated_at":"2022-04-29T12:47:21.319+08:00"},
        //              "components": [
        //                  {
        //                      "id":"lrv093qk3yp5",
        //                      "name":"market data",
        //                      "status":"operational",
        //                      "created_at":"2020-10-29T14:08:59.427+08:00",
        //                      "updated_at":"2020-10-29T14:08:59.427+08:00",
        //                      "position":1,"description":null,
        //                      "showcase":false,
        //                      "start_date":null,
        //                      "group_id":null,
        //                      "page_id":"mn7l2lw8pz4p",
        //                      "group":true,
        //                      "only_show_if_degraded":false,
        //                      "components": [
        //                          "82k5jxg7ltxd" // list of related components
        //                      ]
        //                  },
        //              ],
        //              "incidents": [ // empty array if there are no issues
        //                  {
        //                      "id": "rclfxz2g21ly",  // incident id
        //                      "name": "Market data is delayed",  // incident name
        //                      "status": "investigating",  // incident status
        //                      "created_at": "2020-02-11T03:15:01.913Z",  // incident create time
        //                      "updated_at": "2020-02-11T03:15:02.003Z",   // incident update time
        //                      "monitoring_at": null,
        //                      "resolved_at": null,
        //                      "impact": "minor",  // incident impact
        //                      "shortlink": "http://stspg.io/pkvbwp8jppf9",
        //                      "started_at": "2020-02-11T03:15:01.906Z",
        //                      "page_id": "p0qjfl24znv5",
        //                      "incident_updates": [
        //                          {
        //                              "id": "dwfsk5ttyvtb",
        //                              "status": "investigating",
        //                              "body": "Market data is delayed",
        //                              "incident_id": "rclfxz2g21ly",
        //                              "created_at": "2020-02-11T03:15:02.000Z",
        //                              "updated_at": "2020-02-11T03:15:02.000Z",
        //                              "display_at": "2020-02-11T03:15:02.000Z",
        //                              "affected_components": [
        //                                  {
        //                                      "code": "nctwm9tghxh6",
        //                                      "name": "Market data",
        //                                      "old_status": "operational",
        //                                      "new_status": "degraded_performance"
        //                                  }
        //                              ],
        //                              "deliver_notifications": true,
        //                              "custom_tweet": null,
        //                              "tweet_id": null
        //                          }
        //                      ],
        //                      "components": [
        //                          {
        //                              "id": "nctwm9tghxh6",
        //                              "name": "Market data",
        //                              "status": "degraded_performance",
        //                              "created_at": "2020-01-13T09:34:48.284Z",
        //                              "updated_at": "2020-02-11T03:15:01.951Z",
        //                              "position": 8,
        //                              "description": null,
        //                              "showcase": false,
        //                              "group_id": null,
        //                              "page_id": "p0qjfl24znv5",
        //                              "group": false,
        //                              "only_show_if_degraded": false
        //                          }
        //                      ]
        //                  }, ...
        //              ],
        //              "scheduled_maintenances":[ // empty array if there are no scheduled maintenances
        //                  {
        //                      "id": "k7g299zl765l", // incident id
        //                      "name": "Schedule maintenance", // incident name
        //                      "status": "scheduled", // incident status
        //                      "created_at": "2020-02-11T03:16:31.481Z",  // incident create time
        //                      "updated_at": "2020-02-11T03:16:31.530Z",  // incident update time
        //                      "monitoring_at": null,
        //                      "resolved_at": null,
        //                      "impact": "maintenance",  // incident impact
        //                      "shortlink": "http://stspg.io/md4t4ym7nytd",
        //                      "started_at": "2020-02-11T03:16:31.474Z",
        //                      "page_id": "p0qjfl24znv5",
        //                      "incident_updates": [
        //                          {
        //                              "id": "8whgr3rlbld8",
        //                              "status": "scheduled",
        //                              "body": "We will be undergoing scheduled maintenance during this time.",
        //                              "incident_id": "k7g299zl765l",
        //                              "created_at": "2020-02-11T03:16:31.527Z",
        //                              "updated_at": "2020-02-11T03:16:31.527Z",
        //                              "display_at": "2020-02-11T03:16:31.527Z",
        //                              "affected_components": [
        //                                  {
        //                                      "code": "h028tnzw1n5l",
        //                                      "name": "Deposit And Withdraw - Deposit",
        //                                      "old_status": "operational",
        //                                      "new_status": "operational"
        //                                  }
        //                              ],
        //                              "deliver_notifications": true,
        //                              "custom_tweet": null,
        //                              "tweet_id": null
        //                          }
        //                      ],
        //                      "components": [
        //                          {
        //                              "id": "h028tnzw1n5l",
        //                              "name": "Deposit",
        //                              "status": "operational",
        //                              "created_at": "2019-12-05T02:07:12.372Z",
        //                              "updated_at": "2020-02-10T12:34:52.970Z",
        //                              "position": 1,
        //                              "description": null,
        //                              "showcase": false,
        //                              "group_id": "gtd0nyr3pf0k",
        //                              "page_id": "p0qjfl24znv5",
        //                              "group": false,
        //                              "only_show_if_degraded": false
        //                          }
        //                      ],
        //                      "scheduled_for": "2020-02-15T00:00:00.000Z",  // scheduled maintenance start time
        //                      "scheduled_until": "2020-02-15T01:00:00.000Z"  // scheduled maintenance end time
        //                  }
        //              ],
        //              "status": {
        //                  "indicator":"none", // none, minor, major, critical, maintenance
        //                  "description":"all systems operational" // All Systems Operational, Minor Service Outage, Partial System Outage, Partially Degraded Service, Service Under Maintenance
        //              }
        //          }
        //
        //
        // contractPublicGetHeartbeat
        //
        //      {
        //          "status": "ok", // 'ok', 'error'
        //          "data": {
        //              "heartbeat": 1, // future 1: available, 0: maintenance with service suspended
        //              "estimated_recovery_time": null, // estimated recovery time in milliseconds
        //              "swap_heartbeat": 1,
        //              "swap_estimated_recovery_time": null,
        //              "option_heartbeat": 1,
        //              "option_estimated_recovery_time": null,
        //              "linear_swap_heartbeat": 1,
        //              "linear_swap_estimated_recovery_time": null
        //          },
        //          "ts": 1557714418033
        //      }
        //
        let status = undefined;
        let updated = undefined;
        let url = undefined;
        if (marketType === 'contract') {
            const statusRaw = this.safeString (response, 'status');
            if (statusRaw === undefined) {
                status = undefined;
            } else {
                status = (statusRaw === 'ok') ? 'ok' : 'maintenance'; // 'ok', 'error'
            }
            updated = this.safeString (response, 'ts');
        } else {
            const statusData = this.safeValue (response, 'status', {});
            const statusRaw = this.safeString (statusData, 'indicator');
            status = (statusRaw === 'none') ? 'ok' : 'maintenance'; // none, minor, major, critical, maintenance
            const pageData = this.safeValue (response, 'page', {});
            const datetime = this.safeString (pageData, 'updated_at');
            updated = this.parse8601 (datetime);
            url = this.safeString (pageData, 'url');
        }
        return {
            'status': status,
            'updated': updated,
            'eta': undefined,
            'url': url,
            'info': response,
        };
    }

    /**
     * @method
     * @name htx#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-current-timestamp
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-current-system-timestamp
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime (params = {}): Promise<Int> {
        const options = this.safeValue (this.options, 'fetchTime', {});
        const defaultType = this.safeString (this.options, 'defaultType', 'spot');
        let type = this.safeString (options, 'type', defaultType);
        type = this.safeString (params, 'type', type);
        let response = undefined;
        if ((type === 'future') || (type === 'swap')) {
            response = await this.contractPublicGetApiV1Timestamp (params);
        } else {
            response = await this.spotPublicGetV1CommonTimestamp (params);
        }
        //
        // spot
        //
        //     {"status":"ok","data":1637504261099}
        //
        // future, swap
        //
        //     {"status":"ok","ts":1637504164707}
        //
        return this.safeInteger2 (response, 'data', 'ts');
    }

    parseTradingFee (fee: Dict, market: Market = undefined): TradingFeeInterface {
        //
        //     {
        //         "symbol":"btcusdt",
        //         "actualMakerRate":"0.002",
        //         "actualTakerRate":"0.002",
        //         "takerFeeRate":"0.002",
        //         "makerFeeRate":"0.002"
        //     }
        //
        const marketId = this.safeString (fee, 'symbol');
        return {
            'info': fee,
            'symbol': this.safeSymbol (marketId, market),
            'maker': this.safeNumber (fee, 'actualMakerRate'),
            'taker': this.safeNumber (fee, 'actualTakerRate'),
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    /**
     * @method
     * @name htx#fetchTradingFee
     * @description fetch the trading fees for a market
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-current-fee-rate-applied-to-the-user
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbols': market['id'], // trading symbols comma-separated
        };
        const response = await this.spotPrivateGetV2ReferenceTransactFeeRate (this.extend (request, params));
        //
        //     {
        //         "code":200,
        //         "data":[
        //             {
        //                 "symbol":"btcusdt",
        //                 "actualMakerRate":"0.002",
        //                 "actualTakerRate":"0.002",
        //                 "takerFeeRate":"0.002",
        //                 "makerFeeRate":"0.002"
        //             }
        //         ],
        //         "success":true
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const first = this.safeValue (data, 0, {});
        return this.parseTradingFee (first, market);
    }

    async fetchTradingLimits (symbols: Strings = undefined, params = {}) {
        // this method should not be called directly, use loadTradingLimits () instead
        //  by default it will try load withdrawal fees of all currencies (with separate requests)
        //  however if you define symbols = [ 'ETH/BTC', 'LTC/BTC' ] in args it will only load those
        await this.loadMarkets ();
        if (symbols === undefined) {
            symbols = this.symbols;
        }
        const result: Dict = {};
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            result[symbol] = await this.fetchTradingLimitsById (this.marketId (symbol), params);
        }
        return result;
    }

    /**
     * @ignore
     * @method
     * @name htx#fetchTradingLimitsById
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-current-fee-rate-applied-to-the-user
     * @param {string} id market id
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} the limits object of a market structure
     */
    async fetchTradingLimitsById (id: string, params = {}) {
        const request: Dict = {
            'symbol': id,
        };
        const response = await this.spotPublicGetV1CommonExchange (this.extend (request, params));
        //
        //     { status:   "ok",
        //         "data": {                                  symbol: "aidocbtc",
        //                              "buy-limit-must-less-than":  1.1,
        //                          "sell-limit-must-greater-than":  0.9,
        //                         "limit-order-must-greater-than":  1,
        //                            "limit-order-must-less-than":  5000000,
        //                    "market-buy-order-must-greater-than":  0.0001,
        //                       "market-buy-order-must-less-than":  100,
        //                   "market-sell-order-must-greater-than":  1,
        //                      "market-sell-order-must-less-than":  500000,
        //                       "circuit-break-when-greater-than":  10000,
        //                          "circuit-break-when-less-than":  10,
        //                 "market-sell-order-rate-must-less-than":  0.1,
        //                  "market-buy-order-rate-must-less-than":  0.1        } }
        //
        return this.parseTradingLimits (this.safeValue (response, 'data', {}));
    }

    parseTradingLimits (limits, symbol: Str = undefined, params = {}) {
        //
        //   {                                "symbol": "aidocbtc",
        //                  "buy-limit-must-less-than":  1.1,
        //              "sell-limit-must-greater-than":  0.9,
        //             "limit-order-must-greater-than":  1,
        //                "limit-order-must-less-than":  5000000,
        //        "market-buy-order-must-greater-than":  0.0001,
        //           "market-buy-order-must-less-than":  100,
        //       "market-sell-order-must-greater-than":  1,
        //          "market-sell-order-must-less-than":  500000,
        //           "circuit-break-when-greater-than":  10000,
        //              "circuit-break-when-less-than":  10,
        //     "market-sell-order-rate-must-less-than":  0.1,
        //      "market-buy-order-rate-must-less-than":  0.1        }
        //
        return {
            'info': limits,
            'limits': {
                'amount': {
                    'min': this.safeNumber (limits, 'limit-order-must-greater-than'),
                    'max': this.safeNumber (limits, 'limit-order-must-less-than'),
                },
            },
        };
    }

    costToPrecision (symbol, cost) {
        return this.decimalToPrecision (cost, TRUNCATE, this.markets[symbol]['precision']['cost'], this.precisionMode);
    }

    /**
     * @method
     * @name htx#fetchMarkets
     * @description retrieves data on all markets for huobi
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-trading-symbol-v1-deprecated
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-contract-info
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-swap-info
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-swap-info
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        if (this.options['adjustForTimeDifference']) {
            await this.loadTimeDifference ();
        }
        let types = undefined;
        [ types, params ] = this.handleOptionAndParams (params, 'fetchMarkets', 'types', {});
        let allMarkets = [];
        let promises = [];
        const keys = Object.keys (types);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this.safeBool (types, key)) {
                if (key === 'spot') {
                    promises.push (this.fetchMarketsByTypeAndSubType ('spot', undefined, params));
                } else if (key === 'linear') {
                    promises.push (this.fetchMarketsByTypeAndSubType (undefined, 'linear', params));
                } else if (key === 'inverse') {
                    promises.push (this.fetchMarketsByTypeAndSubType ('swap', 'inverse', params));
                    promises.push (this.fetchMarketsByTypeAndSubType ('future', 'inverse', params));
                }
            }
        }
        promises = await Promise.all (promises);
        for (let i = 0; i < promises.length; i++) {
            allMarkets = this.arrayConcat (allMarkets, promises[i]);
        }
        return allMarkets;
    }

    /**
     * @ignore
     * @method
     * @name htx#fetchMarketsByTypeAndSubType
     * @description retrieves data on all markets of a certain type and/or subtype
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-trading-symbol-v1-deprecated
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-contract-info
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-swap-info
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-swap-info
     * @param {string} [type] 'spot', 'swap' or 'future'
     * @param {string} [subType] 'linear' or 'inverse'
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarketsByTypeAndSubType (type: Str, subType: Str, params = {}) {
        const isSpot = (type === 'spot');
        const request: Dict = {};
        let response = undefined;
        if (!isSpot) {
            if (subType === 'linear') {
                request['business_type'] = 'all'; // override default to fetch all linear markets
                response = await this.contractPublicGetLinearSwapApiV1SwapContractInfo (this.extend (request, params));
            } else if (subType === 'inverse') {
                if (type === 'future') {
                    response = await this.contractPublicGetApiV1ContractContractInfo (this.extend (request, params));
                } else if (type === 'swap') {
                    response = await this.contractPublicGetSwapApiV1SwapContractInfo (this.extend (request, params));
                }
            }
        } else {
            response = await this.spotPublicGetV1CommonSymbols (this.extend (request, params));
        }
        //
        // spot
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "base-currency":"xrp3s",
        //                 "quote-currency":"usdt",
        //                 "price-precision":4,
        //                 "amount-precision":4,
        //                 "symbol-partition":"innovation",
        //                 "symbol":"xrp3susdt",
        //                 "state":"online",
        //                 "value-precision":8,
        //                 "min-order-amt":0.01,
        //                 "max-order-amt":1616.4353,
        //                 "min-order-value":5,
        //                 "limit-order-min-order-amt":0.01,
        //                 "limit-order-max-order-amt":1616.4353,
        //                 "limit-order-max-buy-amt":1616.4353,
        //                 "limit-order-max-sell-amt":1616.4353,
        //                 "sell-market-min-order-amt":0.01,
        //                 "sell-market-max-order-amt":1616.4353,
        //                 "buy-market-max-order-value":2500,
        //                 "max-order-value":2500,
        //                 "underlying":"xrpusdt",
        //                 "mgmt-fee-rate":0.035000000000000000,
        //                 "charge-time":"23:55:00",
        //                 "rebal-time":"00:00:00",
        //                 "rebal-threshold":-5,
        //                 "init-nav":10.000000000000000000,
        //                 "api-trading":"enabled",
        //                 "tags":"etp,nav,holdinglimit"
        //             },
        //         ]
        //     }
        //
        // inverse (swap & future)
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "symbol":"BTC",
        //                 "contract_code":"BTC211126", /// BTC-USD in swap
        //                 "contract_type":"this_week", // only in future
        //                 "contract_size":100,
        //                 "price_tick":0.1,
        //                 "delivery_date":"20211126", // only in future
        //                 "delivery_time":"1637913600000", // empty in swap
        //                 "create_date":"20211112",
        //                 "contract_status":1,
        //                 "settlement_time":"1637481600000" // only in future
        //                 "settlement_date":"16xxxxxxxxxxx" // only in swap
        //             },
        //           ...
        //         ],
        //         "ts":1637474595140
        //     }
        //
        // linear (swap & future)
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "symbol":"BTC",
        //                 "contract_code":"BTC-USDT-211231", // or "BTC-USDT" in swap
        //                 "contract_size":0.001,
        //                 "price_tick":0.1,
        //                 "delivery_date":"20211231", // empty in swap
        //                 "delivery_time":"1640937600000", // empty in swap
        //                 "create_date":"20211228",
        //                 "contract_status":1,
        //                 "settlement_date":"1640764800000",
        //                 "support_margin_mode":"cross", // "all" or "cross"
        //                 "business_type":"futures", // "swap" or "futures"
        //                 "pair":"BTC-USDT",
        //                 "contract_type":"this_week", // "swap", "this_week", "next_week", "quarter"
        //                 "trade_partition":"USDT",
        //             }
        //         ],
        //         "ts":1640736207263
        //     }
        //
        const markets = this.safeList (response, 'data', []);
        const numMarkets = markets.length;
        if (numMarkets < 1) {
            throw new OperationFailed (this.id + ' fetchMarkets() returned an empty response: ' + this.json (response));
        }
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            let baseId = undefined;
            let quoteId = undefined;
            let settleId = undefined;
            let id = undefined;
            let lowercaseId = undefined;
            const contract = ('contract_code' in market);
            const spot = !contract;
            let swap = false;
            let future = false;
            let linear = undefined;
            let inverse = undefined;
            // check if parsed market is contract
            if (contract) {
                id = this.safeString (market, 'contract_code');
                lowercaseId = id.toLowerCase ();
                const delivery_date = this.safeString (market, 'delivery_date');
                const business_type = this.safeString (market, 'business_type');
                future = delivery_date !== undefined;
                swap = !future;
                linear = business_type !== undefined;
                inverse = !linear;
                if (swap) {
                    type = 'swap';
                    const parts = id.split ('-');
                    baseId = this.safeStringLower (market, 'symbol');
                    quoteId = this.safeStringLower (parts, 1);
                    settleId = inverse ? baseId : quoteId;
                } else if (future) {
                    type = 'future';
                    baseId = this.safeStringLower (market, 'symbol');
                    if (inverse) {
                        quoteId = 'USD';
                        settleId = baseId;
                    } else {
                        const pair = this.safeString (market, 'pair');
                        const parts = pair.split ('-');
                        quoteId = this.safeStringLower (parts, 1);
                        settleId = quoteId;
                    }
                }
            } else {
                type = 'spot';
                baseId = this.safeString (market, 'base-currency');
                quoteId = this.safeString (market, 'quote-currency');
                id = baseId + quoteId;
                lowercaseId = id.toLowerCase ();
            }
            const base = this.safeCurrencyCode (baseId);
            const quote = this.safeCurrencyCode (quoteId);
            const settle = this.safeCurrencyCode (settleId);
            let symbol = base + '/' + quote;
            let expiry = undefined;
            if (contract) {
                if (inverse) {
                    symbol += ':' + base;
                } else if (linear) {
                    symbol += ':' + quote;
                }
                if (future) {
                    expiry = this.safeInteger (market, 'delivery_time');
                    symbol += '-' + this.yymmdd (expiry);
                }
            }
            const contractSize = this.safeNumber (market, 'contract_size');
            let minCost = this.safeNumber (market, 'min-order-value');
            const maxAmount = this.safeNumber (market, 'max-order-amt');
            let minAmount = this.safeNumber (market, 'min-order-amt');
            if (contract) {
                if (linear) {
                    minAmount = contractSize;
                } else if (inverse) {
                    minCost = contractSize;
                }
            }
            let pricePrecision = undefined;
            let amountPrecision = undefined;
            let costPrecision = undefined;
            let maker = undefined;
            let taker = undefined;
            let active = undefined;
            if (spot) {
                pricePrecision = this.parseNumber (this.parsePrecision (this.safeString (market, 'price-precision')));
                amountPrecision = this.parseNumber (this.parsePrecision (this.safeString (market, 'amount-precision')));
                costPrecision = this.parseNumber (this.parsePrecision (this.safeString (market, 'value-precision')));
                maker = this.parseNumber ('0.002');
                taker = this.parseNumber ('0.002');
                const state = this.safeString (market, 'state');
                active = (state === 'online');
            } else {
                pricePrecision = this.safeNumber (market, 'price_tick');
                amountPrecision = this.parseNumber ('1'); // other markets have step size of 1 contract
                maker = this.parseNumber ('0.0002');
                taker = this.parseNumber ('0.0005');
                const contractStatus = this.safeInteger (market, 'contract_status');
                active = (contractStatus === 1);
            }
            const leverageRatio = this.safeString (market, 'leverage-ratio', '1');
            const superLeverageRatio = this.safeString (market, 'super-margin-leverage-ratio', '1');
            const hasLeverage = Precise.stringGt (leverageRatio, '1') || Precise.stringGt (superLeverageRatio, '1');
            // 0 Delisting
            // 1 Listing
            // 2 Pending Listing
            // 3 Suspension
            // 4 Suspending of Listing
            // 5 In Settlement
            // 6 Delivering
            // 7 Settlement Completed
            // 8 Delivered
            // 9 Suspending of Trade
            let created = undefined;
            let createdDate = this.safeString (market, 'create_date'); // i.e 20230101
            if (createdDate !== undefined) {
                const createdArray = this.stringToCharsArray (createdDate);
                createdDate = createdArray[0] + createdArray[1] + createdArray[2] + createdArray[3] + '-' + createdArray[4] + createdArray[5] + '-' + createdArray[6] + createdArray[7] + ' 00:00:00';
                created = this.parse8601 (createdDate);
            }
            result.push ({
                'id': id,
                'lowercaseId': lowercaseId,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'settle': settle,
                'baseId': baseId,
                'quoteId': quoteId,
                'settleId': settleId,
                'type': type,
                'spot': spot,
                'margin': (spot && hasLeverage),
                'swap': swap,
                'future': future,
                'option': false,
                'active': active,
                'contract': contract,
                'linear': linear,
                'inverse': inverse,
                'taker': taker,
                'maker': maker,
                'contractSize': contractSize,
                'expiry': expiry,
                'expiryDatetime': this.iso8601 (expiry),
                'strike': undefined,
                'optionType': undefined,
                'precision': {
                    'amount': amountPrecision,
                    'price': pricePrecision,
                    'cost': costPrecision,
                },
                'limits': {
                    'leverage': {
                        'min': this.parseNumber ('1'),
                        'max': this.parseNumber (leverageRatio),
                        'superMax': this.parseNumber (superLeverageRatio),
                    },
                    'amount': {
                        'min': minAmount,
                        'max': maxAmount,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': minCost,
                        'max': undefined,
                    },
                },
                'created': created,
                'info': market,
            });
        }
        return result;
    }

    tryGetSymbolFromFutureMarkets (symbolOrMarketId: string) {
        if (symbolOrMarketId in this.markets) {
            return symbolOrMarketId;
        }
        // only on "future" market type (inverse & linear), market-id differs between "fetchMarkets" and "fetchTicker"
        // so we have to create a mapping
        // - market-id from fetchMarkts:    `BTC-USDT-240419` (linear future) or `BTC240412` (inverse future)
        // - market-id from fetchTciker[s]: `BTC-USDT-CW`     (linear future) or `BTC_CW`    (inverse future)
        if (!('futureMarketIdsForSymbols' in this.options)) {
            this.options['futureMarketIdsForSymbols'] = {};
        }
        const futureMarketIdsForSymbols = this.safeDict (this.options, 'futureMarketIdsForSymbols', {});
        if (symbolOrMarketId in futureMarketIdsForSymbols) {
            return futureMarketIdsForSymbols[symbolOrMarketId];
        }
        const futureMarkets = this.filterBy (this.markets, 'future', true);
        const futuresCharsMaps: Dict = {
            'this_week': 'CW',
            'next_week': 'NW',
            'quarter': 'CQ',
            'next_quarter': 'NQ',
        };
        for (let i = 0; i < futureMarkets.length; i++) {
            const market = futureMarkets[i];
            const info = this.safeValue (market, 'info', {});
            const contractType = this.safeString (info, 'contract_type');
            const contractSuffix = futuresCharsMaps[contractType];
            // see comment on formats a bit above
            const constructedId = market['linear'] ? market['base'] + '-' + market['quote'] + '-' + contractSuffix : market['base'] + '_' + contractSuffix;
            if (constructedId === symbolOrMarketId) {
                const symbol = market['symbol'];
                this.options['futureMarketIdsForSymbols'][symbolOrMarketId] = symbol;
                return symbol;
            }
        }
        // if not found, just save it to avoid unnecessary future iterations
        this.options['futureMarketIdsForSymbols'][symbolOrMarketId] = symbolOrMarketId;
        return symbolOrMarketId;
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        //
        // fetchTicker
        //
        //     {
        //         "amount": 26228.672978342216,
        //         "open": 9078.95,
        //         "close": 9146.86,
        //         "high": 9155.41,
        //         "id": 209988544334,
        //         "count": 265846,
        //         "low": 8988.0,
        //         "version": 209988544334,
        //         "ask": [ 9146.87, 0.156134 ],
        //         "vol": 2.3822168242201668E8,
        //         "bid": [ 9146.86, 0.080758 ],
        //     }
        //
        // fetchTickers
        //
        //     {
        //         "symbol": "bhdht",
        //         "open":  2.3938,
        //         "high":  2.4151,
        //         "low":  2.3323,
        //         "close":  2.3909,
        //         "amount":  628.992,
        //         "vol":  1493.71841095,
        //         "count":  2088,
        //         "bid":  2.3643,
        //         "bidSize":  0.7136,
        //         "ask":  2.4061,
        //         "askSize":  0.4156
        //     }
        //
        // watchTikcer - bbo
        //     {
        //         "seqId": 161499562790,
        //         "ask": 16829.51,
        //         "askSize": 0.707776,
        //         "bid": 16829.5,
        //         "bidSize": 1.685945,
        //         "quoteTime": 1671941599612,
        //         "symbol": "btcusdt"
        //     }
        //
        const marketId = this.safeString2 (ticker, 'symbol', 'contract_code');
        let symbol = this.safeSymbol (marketId, market);
        symbol = this.tryGetSymbolFromFutureMarkets (symbol);
        const timestamp = this.safeInteger2 (ticker, 'ts', 'quoteTime');
        let bid = undefined;
        let bidVolume = undefined;
        let ask = undefined;
        let askVolume = undefined;
        if ('bid' in ticker) {
            if (ticker['bid'] !== undefined && Array.isArray (ticker['bid'])) {
                bid = this.safeString (ticker['bid'], 0);
                bidVolume = this.safeString (ticker['bid'], 1);
            } else {
                bid = this.safeString (ticker, 'bid');
                bidVolume = this.safeString (ticker, 'bidSize');
            }
        }
        if ('ask' in ticker) {
            if (ticker['ask'] !== undefined && Array.isArray (ticker['ask'])) {
                ask = this.safeString (ticker['ask'], 0);
                askVolume = this.safeString (ticker['ask'], 1);
            } else {
                ask = this.safeString (ticker, 'ask');
                askVolume = this.safeString (ticker, 'askSize');
            }
        }
        const open = this.safeString (ticker, 'open');
        const close = this.safeString (ticker, 'close');
        const baseVolume = this.safeString (ticker, 'amount');
        const quoteVolume = this.safeString (ticker, 'vol');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString (ticker, 'high'),
            'low': this.safeString (ticker, 'low'),
            'bid': bid,
            'bidVolume': bidVolume,
            'ask': ask,
            'askVolume': askVolume,
            'vwap': undefined,
            'open': open,
            'close': close,
            'last': close,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name htx#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-latest-aggregated-ticker
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-market-data-overview
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-market-data-overview
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-market-data-overview
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        let response = undefined;
        if (market['linear']) {
            request['contract_code'] = market['id'];
            response = await this.contractPublicGetLinearSwapExMarketDetailMerged (this.extend (request, params));
        } else if (market['inverse']) {
            if (market['future']) {
                request['symbol'] = market['id'];
                response = await this.contractPublicGetMarketDetailMerged (this.extend (request, params));
            } else if (market['swap']) {
                request['contract_code'] = market['id'];
                response = await this.contractPublicGetSwapExMarketDetailMerged (this.extend (request, params));
            }
        } else {
            request['symbol'] = market['id'];
            response = await this.spotPublicGetMarketDetailMerged (this.extend (request, params));
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.detail.merged",
        //         "ts": 1583494336669,
        //         "tick": {
        //             "amount": 26228.672978342216,
        //             "open": 9078.95,
        //             "close": 9146.86,
        //             "high": 9155.41,
        //             "id": 209988544334,
        //             "count": 265846,
        //             "low": 8988.0,
        //             "version": 209988544334,
        //             "ask": [ 9146.87, 0.156134 ],
        //             "vol": 2.3822168242201668E8,
        //             "bid": [ 9146.86, 0.080758 ],
        //         }
        //     }
        //
        // future, swap
        //
        //     {
        //         "ch":"market.BTC211126.detail.merged",
        //         "status":"ok",
        //         "tick":{
        //             "amount":"669.3385682049668320322569544150680718474",
        //             "ask":[59117.44,48],
        //             "bid":[59082,48],
        //             "close":"59087.97",
        //             "count":5947,
        //             "high":"59892.62",
        //             "id":1637502670,
        //             "low":"57402.87",
        //             "open":"57638",
        //             "ts":1637502670059,
        //             "vol":"394598"
        //         },
        //         "ts":1637502670059
        //     }
        //
        const tick = this.safeValue (response, 'tick', {});
        const ticker = this.parseTicker (tick, market);
        const timestamp = this.safeInteger (response, 'ts');
        ticker['timestamp'] = timestamp;
        ticker['datetime'] = this.iso8601 (timestamp);
        return ticker;
    }

    /**
     * @method
     * @name htx#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-latest-tickers-for-all-pairs
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-a-batch-of-market-data-overview
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-a-batch-of-market-data-overview
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-a-batch-of-market-data-overview-v2
     * @param {string[]} [symbols] unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const first = this.safeString (symbols, 0);
        let market = undefined;
        if (first !== undefined) {
            market = this.market (first);
        }
        const isSubTypeRequested = ('subType' in params) || ('business_type' in params);
        let type = undefined;
        let subType = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchTickers', market, params);
        [ subType, params ] = this.handleSubTypeAndParams ('fetchTickers', market, params);
        const request: Dict = {};
        const isSpot = (type === 'spot');
        const future = (type === 'future');
        const swap = (type === 'swap');
        const linear = (subType === 'linear');
        const inverse = (subType === 'inverse');
        let response = undefined;
        if (!isSpot || isSubTypeRequested) {
            if (linear) {
                // independently of type, supports calling all linear symbols i.e. fetchTickers(undefined, {subType:'linear'})
                if (future) {
                    request['business_type'] = 'futures';
                } else if (swap) {
                    request['business_type'] = 'swap';
                } else {
                    request['business_type'] = 'all';
                }
                response = await this.contractPublicGetLinearSwapExMarketDetailBatchMerged (this.extend (request, params));
            } else if (inverse) {
                if (future) {
                    response = await this.contractPublicGetMarketDetailBatchMerged (this.extend (request, params));
                } else if (swap) {
                    response = await this.contractPublicGetSwapExMarketDetailBatchMerged (this.extend (request, params));
                } else {
                    throw new NotSupported (this.id + ' fetchTickers() you have to set params["type"] to either "swap" or "future" for inverse contracts');
                }
            } else {
                throw new NotSupported (this.id + ' fetchTickers() you have to set params["subType"] to either "linear" or "inverse" for contracts');
            }
        } else {
            response = await this.spotPublicGetMarketTickers (this.extend (request, params));
        }
        //
        // spot
        //
        //     {
        //         "data":[
        //             {
        //                 "symbol":"hbcbtc",
        //                 "open":5.313E-5,
        //                 "high":5.34E-5,
        //                 "low":5.112E-5,
        //                 "close":5.175E-5,
        //                 "amount":1183.87,
        //                 "vol":0.0618599229,
        //                 "count":205,
        //                 "bid":5.126E-5,
        //                 "bidSize":5.25,
        //                 "ask":5.214E-5,
        //                 "askSize":150.0
        //             },
        //         ],
        //         "status":"ok",
        //         "ts":1639547261293
        //     }
        //
        // linear swap, linear future, inverse swap, inverse future
        //
        //     {
        //         "status":"ok",
        //         "ticks":[
        //             {
        //                 "id":1637504679,
        //                 "ts":1637504679372,
        //                 "ask":[0.10644,100],
        //                 "bid":[0.10624,26],
        //                 "symbol":"TRX_CW",
        //                 "open":"0.10233",
        //                 "close":"0.10644",
        //                 "low":"0.1017",
        //                 "high":"0.10725",
        //                 "amount":"2340267.415144052378486261756692535687481566",
        //                 "count":882,
        //                 "vol":"24706",
        //                 "trade_turnover":"840726.5048", // only in linear futures
        //                 "business_type":"futures", // only in linear futures
        //                 "contract_code":"BTC-USDT-CW", // only in linear futures, instead of 'symbol'
        //             }
        //         ],
        //         "ts":1637504679376
        //     }
        //
        const rawTickers = this.safeList2 (response, 'data', 'ticks', []);
        const tickers = this.parseTickers (rawTickers, symbols, params);
        return this.filterByArrayTickers (tickers, 'symbol', symbols);
    }

    /**
     * @method
     * @name htx#fetchLastPrices
     * @description fetches the last price for multiple markets
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=8cb81024-77b5-11ed-9966-0242ac110003 linear swap & linear future
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=28c2e8fc-77ae-11ed-9966-0242ac110003 inverse future
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=5d517ef5-77b6-11ed-9966-0242ac110003 inverse swap
     * @param {string[]} [symbols] unified symbols of the markets to fetch the last prices
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of lastprices structures
     */
    async fetchLastPrices (symbols: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const market = this.getMarketFromSymbols (symbols);
        let type = undefined;
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLastPrices', market, params);
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLastPrices', market, params);
        let response = undefined;
        if (((type === 'swap') || (type === 'future')) && (subType === 'linear')) {
            response = await this.contractPublicGetLinearSwapExMarketTrade (params);
            //
            //     {
            //         "ch": "market.*.trade.detail",
            //         "status": "ok",
            //         "tick": {
            //           "data": [
            //             {
            //               "amount": "4",
            //               "quantity": "40",
            //               "trade_turnover": "22.176",
            //               "ts": 1703697705028,
            //               "id": 1000003558478170000,
            //               "price": "0.5544",
            //               "direction": "buy",
            //               "contract_code": "MANA-USDT",
            //               "business_type": "swap",
            //               "trade_partition": "USDT"
            //             },
            //           ],
            //           "id": 1703697740147,
            //           "ts": 1703697740147
            //         },
            //         "ts": 1703697740147
            //     }
            //
        } else if ((type === 'swap') && (subType === 'inverse')) {
            response = await this.contractPublicGetSwapExMarketTrade (params);
            //
            //     {
            //         "ch": "market.*.trade.detail",
            //         "status": "ok",
            //         "tick": {
            //           "data": [
            //             {
            //               "amount": "6",
            //               "quantity": "94.5000945000945000945000945000945000945",
            //               "ts": 1703698704594,
            //               "id": 1000001187811060000,
            //               "price": "0.63492",
            //               "direction": "buy",
            //               "contract_code": "XRP-USD"
            //             },
            //           ],
            //           "id": 1703698706589,
            //           "ts": 1703698706589
            //         },
            //         "ts": 1703698706589
            //     }
            //
        } else if ((type === 'future') && (subType === 'inverse')) {
            response = await this.contractPublicGetMarketTrade (params);
            //
            //     {
            //         "ch": "market.*.trade.detail",
            //         "status": "ok",
            //         "tick": {
            //           "data": [
            //             {
            //               "amount": "20",
            //               "quantity": "44.4444444444444444444444444444444444444",
            //               "ts": 1686134498885,
            //               "id": 2323000000174820000,
            //               "price": "4.5",
            //               "direction": "sell",
            //               "symbol": "DORA_CW"
            //             },
            //           ],
            //           "id": 1703698855142,
            //           "ts": 1703698855142
            //         },
            //         "ts": 1703698855142
            //     }
            //
        } else {
            throw new NotSupported (this.id + ' fetchLastPrices() does not support ' + type + ' markets yet');
        }
        const tick = this.safeValue (response, 'tick', {});
        const data = this.safeList (tick, 'data', []);
        return this.parseLastPrices (data, symbols);
    }

    parseLastPrice (entry, market: Market = undefined) {
        // example responses are documented in fetchLastPrices
        const marketId = this.safeString2 (entry, 'symbol', 'contract_code');
        market = this.safeMarket (marketId, market);
        const price = this.safeNumber (entry, 'price');
        const direction = this.safeString (entry, 'direction'); // "buy" or "sell"
        // group timestamp should not be assigned to the individual trades' times
        return {
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'price': price,
            'side': direction,
            'info': entry,
        };
    }

    /**
     * @method
     * @name htx#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-market-depth
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-market-depth
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-market-depth
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-market-depth
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            //
            // from the API docs
            //
            //     to get depth data within step 150, use step0, step1, step2, step3, step4, step5, step14, step15（merged depth data 0-5,14-15, when step is 0，depth data will not be merged
            //     to get depth data within step 20, use step6, step7, step8, step9, step10, step11, step12, step13(merged depth data 7-13), when step is 6, depth data will not be merged
            //
            'type': 'step0',
            // 'symbol': market['id'], // spot, future
            // 'contract_code': market['id'], // swap
        };
        let response = undefined;
        if (market['linear']) {
            request['contract_code'] = market['id'];
            response = await this.contractPublicGetLinearSwapExMarketDepth (this.extend (request, params));
        } else if (market['inverse']) {
            if (market['future']) {
                request['symbol'] = market['id'];
                response = await this.contractPublicGetMarketDepth (this.extend (request, params));
            } else if (market['swap']) {
                request['contract_code'] = market['id'];
                response = await this.contractPublicGetSwapExMarketDepth (this.extend (request, params));
            }
        } else {
            if (limit !== undefined) {
                // Valid depths are 5, 10, 20 or empty https://huobiapi.github.io/docs/spot/v1/en/#get-market-depth
                if ((limit !== 5) && (limit !== 10) && (limit !== 20) && (limit !== 150)) {
                    throw new BadRequest (this.id + ' fetchOrderBook() limit argument must be undefined, 5, 10, 20, or 150, default is 150');
                }
                // only set the depth if it is not 150
                // 150 is the implicit default on the exchange side for step0 and no orderbook aggregation
                // it is not accepted by the exchange if you set it explicitly
                if (limit !== 150) {
                    request['depth'] = limit;
                }
            }
            request['symbol'] = market['id'];
            response = await this.spotPublicGetMarketDepth (this.extend (request, params));
        }
        //
        // spot, future, swap
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.depth.step0",
        //         "ts": 1583474832790,
        //         "tick": {
        //             "bids": [
        //                 [ 9100.290000000000000000, 0.200000000000000000 ],
        //                 [ 9099.820000000000000000, 0.200000000000000000 ],
        //                 [ 9099.610000000000000000, 0.205000000000000000 ],
        //             ],
        //             "asks": [
        //                 [ 9100.640000000000000000, 0.005904000000000000 ],
        //                 [ 9101.010000000000000000, 0.287311000000000000 ],
        //                 [ 9101.030000000000000000, 0.012121000000000000 ],
        //             ],
        //             "ch":"market.BTC-USD.depth.step0",
        //             "ts":1583474832008,
        //             "id":1637554816,
        //             "mrid":121654491624,
        //             "version":104999698781
        //         }
        //     }
        //
        if ('tick' in response) {
            if (!response['tick']) {
                throw new BadSymbol (this.id + ' fetchOrderBook() returned empty response: ' + this.json (response));
            }
            const tick = this.safeValue (response, 'tick');
            const timestamp = this.safeInteger (tick, 'ts', this.safeInteger (response, 'ts'));
            const result = this.parseOrderBook (tick, symbol, timestamp);
            result['nonce'] = this.safeInteger (tick, 'version');
            return result;
        }
        throw new ExchangeError (this.id + ' fetchOrderBook() returned unrecognized response: ' + this.json (response));
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        //
        // spot fetchTrades (public)
        //
        //     {
        //         "amount": 0.010411000000000000,
        //         "trade-id": 102090736910,
        //         "ts": 1583497692182,
        //         "id": 10500517034273194594947,
        //         "price": 9096.050000000000000000,
        //         "direction": "sell"
        //     }
        //
        // spot fetchMyTrades (private)
        //
        //     {
        //          "symbol": "swftcbtc",
        //          "fee-currency": "swftc",
        //          "filled-fees": "0",
        //          "source": "spot-api",
        //          "id": 83789509854000,
        //          "type": "buy-limit",
        //          "order-id": 83711103204909,
        //          'filled-points': "0.005826843283532154",
        //          "fee-deduct-currency": "ht",
        //          'filled-amount': "45941.53",
        //          "price": "0.0000001401",
        //          "created-at": 1597933260729,
        //          "match-id": 100087455560,
        //          "role": "maker",
        //          "trade-id": 100050305348
        //     }
        //
        // linear swap isolated margin fetchOrder details
        //
        //     {
        //         "trade_id": 131560927,
        //         "trade_price": 13059.800000000000000000,
        //         "trade_volume": 1.000000000000000000,
        //         "trade_turnover": 13.059800000000000000,
        //         "trade_fee": -0.005223920000000000,
        //         "created_at": 1603703614715,
        //         "role": "taker",
        //         "fee_asset": "USDT",
        //         "profit": 0,
        //         "real_profit": 0,
        //         "id": "131560927-770334322963152896-1"
        //     }
        //
        // inverse swap cross margin fetchMyTrades
        //
        //     {
        //         "contract_type":"swap",
        //         "pair":"O3-USDT",
        //         "business_type":"swap",
        //         "query_id":652123190,
        //         "match_id":28306009409,
        //         "order_id":941137865226903553,
        //         "symbol":"O3",
        //         "contract_code":"O3-USDT",
        //         "direction":"sell",
        //         "offset":"open",
        //         "trade_volume":100.000000000000000000,
        //         "trade_price":0.398500000000000000,
        //         "trade_turnover":39.850000000000000000,
        //         "trade_fee":-0.007970000000000000,
        //         "offset_profitloss":0E-18,
        //         "create_date":1644426352999,
        //         "role":"Maker",
        //         "order_source":"api",
        //         "order_id_str":"941137865226903553",
        //         "id":"28306009409-941137865226903553-1",
        //         "fee_asset":"USDT",
        //         "margin_mode":"cross",
        //         "margin_account":"USDT",
        //         "real_profit":0E-18,
        //         "trade_partition":"USDT"
        //     }
        //
        const marketId = this.safeString2 (trade, 'contract_code', 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        let timestamp = this.safeInteger2 (trade, 'ts', 'created-at');
        timestamp = this.safeInteger2 (trade, 'created_at', 'create_date', timestamp);
        const order = this.safeString2 (trade, 'order-id', 'order_id');
        let side = this.safeString (trade, 'direction');
        let type = this.safeString (trade, 'type');
        if (type !== undefined) {
            const typeParts = type.split ('-');
            side = typeParts[0];
            type = typeParts[1];
        }
        const takerOrMaker = this.safeStringLower (trade, 'role');
        const priceString = this.safeString2 (trade, 'price', 'trade_price');
        let amountString = this.safeString2 (trade, 'filled-amount', 'amount');
        amountString = this.safeString (trade, 'trade_volume', amountString);
        const costString = this.safeString (trade, 'trade_turnover');
        let fee = undefined;
        let feeCost = this.safeString (trade, 'filled-fees');
        if (feeCost === undefined) {
            feeCost = Precise.stringNeg (this.safeString (trade, 'trade_fee'));
        }
        const feeCurrencyId = this.safeString2 (trade, 'fee-currency', 'fee_asset');
        let feeCurrency = this.safeCurrencyCode (feeCurrencyId);
        const filledPoints = this.safeString (trade, 'filled-points');
        if (filledPoints !== undefined) {
            if ((feeCost === undefined) || Precise.stringEquals (feeCost, '0')) {
                const feeDeductCurrency = this.safeString (trade, 'fee-deduct-currency');
                if (feeDeductCurrency !== undefined) {
                    feeCost = filledPoints;
                    feeCurrency = this.safeCurrencyCode (feeDeductCurrency);
                }
            }
        }
        if (feeCost !== undefined) {
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
            };
        }
        const id = this.safeStringN (trade, [ 'trade_id', 'trade-id', 'id' ]);
        return this.safeTrade ({
            'id': id,
            'info': trade,
            'order': order,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'type': type,
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': priceString,
            'amount': amountString,
            'cost': costString,
            'fee': fee,
        }, market);
    }

    /**
     * @method
     * @name htx#fetchOrderTrades
     * @description fetch all the trades made from a single order
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-the-match-result-of-an-order
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchOrderTrades (id: string, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOrderTrades', market, params);
        if (marketType !== 'spot') {
            throw new NotSupported (this.id + ' fetchOrderTrades() is only supported for spot markets');
        }
        return await this.fetchSpotOrderTrades (id, symbol, since, limit, params);
    }

    /**
     * @ignore
     * @method
     * @name htx#fetchOrderTrades
     * @description fetch all the trades made from a single order
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-the-match-result-of-an-order
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchSpotOrderTrades (id: string, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'order-id': id,
        };
        const response = await this.spotPrivateGetV1OrderOrdersOrderIdMatchresults (this.extend (request, params));
        return this.parseTrades (response['data'], undefined, since, limit);
    }

    /**
     * @method
     * @name htx#fetchMyTrades
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-get-history-match-results-via-multiple-fields-new
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-get-history-match-results-via-multiple-fields-new
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-match-results
     * @description fetch all trades made by the user
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch trades for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchMyTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchMyTrades', symbol, since, limit, params) as Trade[];
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchMyTrades', market, params);
        let request: Dict = {
            // spot -----------------------------------------------------------
            // 'symbol': market['id'],
            // 'types': 'buy-market,sell-market,buy-limit,sell-limit,buy-ioc,sell-ioc,buy-limit-maker,sell-limit-maker,buy-stop-limit,sell-stop-limit',
            // 'start-time': since, // max 48 hours within 120 days
            // 'end-time': this.milliseconds (), // max 48 hours within 120 days
            // 'from': 'id', // tring false N/A Search internal id to begin with if search next page, then this should be the last id (not trade-id) of last page; if search previous page, then this should be the first id (not trade-id) of last page
            // 'direct': 'next', // next, prev
            // 'size': limit, // default 100, max 500 The number of orders to return [1-500]
            // contracts ------------------------------------------------------
            // 'symbol': market['settleId'], // required
            // 'trade_type': 0, // required, 0 all, 1 open long, 2 open short, 3 close short, 4 close long, 5 liquidate long positions, 6 liquidate short positions
            // 'contract_code': market['id'],
            // 'start_time': since, // max 48 hours within 120 days
            // 'end_time': this.milliseconds (), // max 48 hours within 120 days
            // 'from_id': 'id', // tring false N/A Search internal id to begin with if search next page, then this should be the last id (not trade-id) of last page; if search previous page, then this should be the first id (not trade-id) of last page
            // 'direct': 'prev', // next, prev
            // 'size': limit, // default 20, max 50
        };
        let response = undefined;
        if (marketType === 'spot') {
            if (symbol !== undefined) {
                market = this.market (symbol);
                request['symbol'] = market['id'];
            }
            if (limit !== undefined) {
                request['size'] = limit; // default 100, max 500
            }
            if (since !== undefined) {
                request['start-time'] = since; // a date within 120 days from today
                // request['end-time'] = this.sum (since, 172800000); // 48 hours window
            }
            [ request, params ] = this.handleUntilOption ('end-time', request, params);
            response = await this.spotPrivateGetV1OrderMatchresults (this.extend (request, params));
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
            }
            request['contract'] = market['id'];
            request['trade_type'] = 0; // 0 all, 1 open long, 2 open short, 3 close short, 4 close long, 5 liquidate long positions, 6 liquidate short positions
            if (since !== undefined) {
                request['start_time'] = since; // a date within 120 days from today
                // request['end_time'] = this.sum (request['start_time'], 172800000); // 48 hours window
            }
            [ request, params ] = this.handleUntilOption ('end_time', request, params);
            if (limit !== undefined) {
                request['page_size'] = limit; // default 100, max 500
            }
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('fetchMyTrades', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    response = await this.contractPrivatePostLinearSwapApiV3SwapMatchresultsExact (this.extend (request, params));
                } else if (marginMode === 'cross') {
                    response = await this.contractPrivatePostLinearSwapApiV3SwapCrossMatchresultsExact (this.extend (request, params));
                }
            } else if (market['inverse']) {
                if (marketType === 'future') {
                    request['symbol'] = market['settleId'];
                    response = await this.contractPrivatePostApiV3ContractMatchresultsExact (this.extend (request, params));
                } else if (marketType === 'swap') {
                    response = await this.contractPrivatePostSwapApiV3SwapMatchresultsExact (this.extend (request, params));
                } else {
                    throw new NotSupported (this.id + ' fetchMyTrades() does not support ' + marketType + ' markets');
                }
            }
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "symbol": "polyusdt",
        //                 "fee-currency": "poly",
        //                 "source": "spot-web",
        //                 "price": "0.338",
        //                 "created-at": 1629443051839,
        //                 "role": "taker",
        //                 "order-id": 345487249132375,
        //                 "match-id": 5014,
        //                 "trade-id": 1085,
        //                 "filled-amount": "147.928994082840236",
        //                 "filled-fees": "0",
        //                 "filled-points": "0.1",
        //                 "fee-deduct-currency": "hbpoint",
        //                 "fee-deduct-state": "done",
        //                 "id": 313288753120940,
        //                 "type": "buy-market"
        //             }
        //         ]
        //     }
        //
        // contracts
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "trades": [
        //                 {
        //                     "query_id": 2424420723,
        //                     "match_id": 113891764710,
        //                     "order_id": 773135295142658048,
        //                     "symbol": "ADA",
        //                     "contract_type": "quarter", // swap
        //                     "business_type": "futures", // swap
        //                     "contract_code": "ADA201225",
        //                     "direction": "buy",
        //                     "offset": "open",
        //                     "trade_volume": 1,
        //                     "trade_price": 0.092,
        //                     "trade_turnover": 10,
        //                     "trade_fee": -0.021739130434782608,
        //                     "offset_profitloss": 0,
        //                     "create_date": 1604371703183,
        //                     "role": "Maker",
        //                     "order_source": "web",
        //                     "order_id_str": "773135295142658048",
        //                     "fee_asset": "ADA",
        //                     "margin_mode": "isolated", // cross
        //                     "margin_account": "BTC-USDT",
        //                     "real_profit": 0,
        //                     "id": "113891764710-773135295142658048-1",
        //                     "trade_partition":"USDT",
        //                 }
        //             ],
        //             "remain_size": 15,
        //             "next_id": 2424413094
        //         },
        //         "ts": 1604372202243
        //     }
        //
        let trades = this.safeValue (response, 'data');
        if (!Array.isArray (trades)) {
            trades = this.safeValue (trades, 'trades');
        }
        return this.parseTrades (trades, market, since, limit);
    }

    /**
     * @method
     * @name htx#fetchTrades
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-the-most-recent-trades
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-a-batch-of-trade-records-of-a-contract
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-a-batch-of-trade-records-of-a-contract
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-a-batch-of-trade-records-of-a-contract
     * @description get the list of most recent trades for a particular symbol
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] timestamp in ms of the earliest trade to fetch
     * @param {int} [limit] the maximum amount of trades to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = 1000, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            // 'symbol': market['id'], // spot, future
            // 'contract_code': market['id'], // swap
        };
        if (limit !== undefined) {
            request['size'] = Math.min (limit, 2000); // max 2000
        }
        let response = undefined;
        if (market['future']) {
            if (market['inverse']) {
                request['symbol'] = market['id'];
                response = await this.contractPublicGetMarketHistoryTrade (this.extend (request, params));
            } else if (market['linear']) {
                request['contract_code'] = market['id'];
                response = await this.contractPublicGetLinearSwapExMarketHistoryTrade (this.extend (request, params));
            }
        } else if (market['swap']) {
            request['contract_code'] = market['id'];
            if (market['inverse']) {
                response = await this.contractPublicGetSwapExMarketHistoryTrade (this.extend (request, params));
            } else if (market['linear']) {
                response = await this.contractPublicGetLinearSwapExMarketHistoryTrade (this.extend (request, params));
            }
        } else {
            request['symbol'] = market['id'];
            response = await this.spotPublicGetMarketHistoryTrade (this.extend (request, params));
        }
        //
        //     {
        //         "status": "ok",
        //         "ch": "market.btcusdt.trade.detail",
        //         "ts": 1583497692365,
        //         "data": [
        //             {
        //                 "id": 105005170342,
        //                 "ts": 1583497692182,
        //                 "data": [
        //                     {
        //                         "amount": 0.010411000000000000,
        //                         "trade-id": 102090736910,
        //                         "ts": 1583497692182,
        //                         "id": 10500517034273194594947,
        //                         "price": 9096.050000000000000000,
        //                         "direction": "sell"
        //                     }
        //                 ]
        //             },
        //             // ...
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        let result = [];
        for (let i = 0; i < data.length; i++) {
            const trades = this.safeValue (data[i], 'data', []);
            for (let j = 0; j < trades.length; j++) {
                const trade = this.parseTrade (trades[j], market);
                result.push (trade);
            }
        }
        result = this.sortBy (result, 'timestamp');
        return this.filterBySymbolSinceLimit (result, market['symbol'], since, limit) as Trade[];
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //     {
        //         "amount":1.2082,
        //         "open":0.025096,
        //         "close":0.025095,
        //         "high":0.025096,
        //         "id":1591515300,
        //         "count":6,
        //         "low":0.025095,
        //         "vol":0.0303205097
        //     }
        //
        return [
            this.safeTimestamp (ohlcv, 'id'),
            this.safeNumber (ohlcv, 'open'),
            this.safeNumber (ohlcv, 'high'),
            this.safeNumber (ohlcv, 'low'),
            this.safeNumber (ohlcv, 'close'),
            this.safeNumber (ohlcv, 'amount'),
        ];
    }

    /**
     * @method
     * @name htx#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-klines-candles
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-kline-data
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-kline-data
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-kline-data
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {string} [params.useHistoricalEndpointForSpot] true/false - whether use the historical candles endpoint for spot markets or default klines endpoint
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOHLCV', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchOHLCV', symbol, since, limit, timeframe, params, 1000) as OHLCV[];
        }
        const market = this.market (symbol);
        const request: Dict = {
            'period': this.safeString (this.timeframes, timeframe, timeframe),
            // 'symbol': market['id'], // spot, future
            // 'contract_code': market['id'], // swap
            // 'size': 1000, // max 1000 for spot, 2000 for contracts
            // 'from': parseInt ((since / 1000).toString ()), spot only
            // 'to': this.seconds (), spot only
        };
        const priceType = this.safeStringN (params, [ 'priceType', 'price' ]);
        params = this.omit (params, [ 'priceType', 'price' ]);
        let until = undefined;
        [ until, params ] = this.handleParamInteger (params, 'until');
        const untilSeconds = (until !== undefined) ? this.parseToInt (until / 1000) : undefined;
        if (market['contract']) {
            if (limit !== undefined) {
                request['size'] = Math.min (limit, 2000); // when using limit: from & to are ignored
                // https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-kline-data
            } else {
                limit = 2000; // only used for from/to calculation
            }
            if (priceType === undefined) {
                const duration = this.parseTimeframe (timeframe);
                let calcualtedEnd = undefined;
                if (since === undefined) {
                    const now = this.seconds ();
                    request['from'] = now - duration * (limit - 1);
                    calcualtedEnd = now;
                } else {
                    const start = this.parseToInt (since / 1000);
                    request['from'] = start;
                    calcualtedEnd = this.sum (start, duration * (limit - 1));
                }
                request['to'] = (untilSeconds !== undefined) ? untilSeconds : calcualtedEnd;
            }
        }
        let response = undefined;
        if (market['future']) {
            if (market['inverse']) {
                request['symbol'] = market['id'];
                if (priceType === 'mark') {
                    response = await this.contractPublicGetIndexMarketHistoryMarkPriceKline (this.extend (request, params));
                } else if (priceType === 'index') {
                    response = await this.contractPublicGetIndexMarketHistoryIndex (this.extend (request, params));
                } else if (priceType === 'premiumIndex') {
                    throw new BadRequest (this.id + ' ' + market['type'] + ' has no api endpoint for ' + priceType + ' kline data');
                } else {
                    response = await this.contractPublicGetMarketHistoryKline (this.extend (request, params));
                }
            } else if (market['linear']) {
                request['contract_code'] = market['id'];
                if (priceType === 'mark') {
                    response = await this.contractPublicGetIndexMarketHistoryLinearSwapMarkPriceKline (this.extend (request, params));
                } else if (priceType === 'index') {
                    throw new BadRequest (this.id + ' ' + market['type'] + ' has no api endpoint for ' + priceType + ' kline data');
                } else if (priceType === 'premiumIndex') {
                    response = await this.contractPublicGetIndexMarketHistoryLinearSwapPremiumIndexKline (this.extend (request, params));
                } else {
                    response = await this.contractPublicGetLinearSwapExMarketHistoryKline (this.extend (request, params));
                }
            }
        } else if (market['swap']) {
            request['contract_code'] = market['id'];
            if (market['inverse']) {
                if (priceType === 'mark') {
                    response = await this.contractPublicGetIndexMarketHistorySwapMarkPriceKline (this.extend (request, params));
                } else if (priceType === 'index') {
                    throw new BadRequest (this.id + ' ' + market['type'] + ' has no api endpoint for ' + priceType + ' kline data');
                } else if (priceType === 'premiumIndex') {
                    response = await this.contractPublicGetIndexMarketHistorySwapPremiumIndexKline (this.extend (request, params));
                } else {
                    response = await this.contractPublicGetSwapExMarketHistoryKline (this.extend (request, params));
                }
            } else if (market['linear']) {
                if (priceType === 'mark') {
                    response = await this.contractPublicGetIndexMarketHistoryLinearSwapMarkPriceKline (this.extend (request, params));
                } else if (priceType === 'index') {
                    throw new BadRequest (this.id + ' ' + market['type'] + ' has no api endpoint for ' + priceType + ' kline data');
                } else if (priceType === 'premiumIndex') {
                    response = await this.contractPublicGetIndexMarketHistoryLinearSwapPremiumIndexKline (this.extend (request, params));
                } else {
                    response = await this.contractPublicGetLinearSwapExMarketHistoryKline (this.extend (request, params));
                }
            }
        } else {
            request['symbol'] = market['id'];
            let useHistorical = undefined;
            [ useHistorical, params ] = this.handleOptionAndParams (params, 'fetchOHLCV', 'useHistoricalEndpointForSpot', true);
            if (!useHistorical) {
                if (limit !== undefined) {
                    request['size'] = Math.min (limit, 2000); // max 2000
                }
                response = await this.spotPublicGetMarketHistoryKline (this.extend (request, params));
            } else {
                // "from & to" only available for the this endpoint
                if (since !== undefined) {
                    request['from'] = this.parseToInt (since / 1000);
                }
                if (untilSeconds !== undefined) {
                    request['to'] = untilSeconds;
                }
                if (limit !== undefined) {
                    request['size'] = Math.min (1000, limit); // max 1000, otherwise default returns 150
                }
                response = await this.spotPublicGetMarketHistoryCandles (this.extend (request, params));
            }
        }
        //
        //     {
        //         "status":"ok",
        //         "ch":"market.ethbtc.kline.1min",
        //         "ts":1591515374371,
        //         "data":[
        //             {"amount":0.0,"open":0.025095,"close":0.025095,"high":0.025095,"id":1591515360,"count":0,"low":0.025095,"vol":0.0},
        //             {"amount":1.2082,"open":0.025096,"close":0.025095,"high":0.025096,"id":1591515300,"count":6,"low":0.025095,"vol":0.0303205097},
        //             {"amount":0.0648,"open":0.025096,"close":0.025096,"high":0.025096,"id":1591515240,"count":2,"low":0.025096,"vol":0.0016262208},
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOHLCVs (data, market, timeframe, since, limit);
    }

    /**
     * @method
     * @name htx#fetchAccounts
     * @description fetch all the accounts associated with a profile
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-accounts-of-the-current-user
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
     */
    async fetchAccounts (params = {}): Promise<Account[]> {
        await this.loadMarkets ();
        const response = await this.spotPrivateGetV1AccountAccounts (params);
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {"id":5202591,"type":"point","subtype":"","state":"working"},
        //             {"id":1528640,"type":"spot","subtype":"","state":"working"},
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data');
        return this.parseAccounts (data);
    }

    parseAccount (account) {
        //
        //     {
        //         "id": 5202591,
        //         "type": "point",   // spot, margin, otc, point, super-margin, investment, borrow, grid-trading, deposit-earning, otc-options
        //         "subtype": "",     // The corresponding trading symbol (currency pair) the isolated margin is based on, e.g. btcusdt
        //         "state": "working" // working, lock
        //     }
        //
        const typeId = this.safeString (account, 'type');
        const accountsById = this.safeValue (this.options, 'accountsById', {});
        const type = this.safeValue (accountsById, typeId, typeId);
        return {
            'info': account,
            'id': this.safeString (account, 'id'),
            'type': type,
            'code': undefined,
        };
    }

    /**
     * @method
     * @name htx#fetchAccountIdByType
     * @description fetch all the accounts by a type and marginModeassociated with a profile
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-accounts-of-the-current-user
     * @param {string} type 'spot', 'swap' or 'future
     * @param {string} [marginMode] 'cross' or 'isolated'
     * @param {string} [symbol] unified ccxt market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [account structures]{@link https://docs.ccxt.com/#/?id=account-structure} indexed by the account type
     */
    async fetchAccountIdByType (type: string, marginMode: Str = undefined, symbol: Str = undefined, params = {}) {
        const accounts = await this.loadAccounts ();
        const accountId = this.safeValue2 (params, 'accountId', 'account-id');
        if (accountId !== undefined) {
            return accountId;
        }
        if (type === 'spot') {
            if (marginMode === 'cross') {
                type = 'super-margin';
            } else if (marginMode === 'isolated') {
                type = 'margin';
            }
        }
        let marketId = undefined;
        if (symbol !== undefined) {
            marketId = this.marketId (symbol);
        }
        for (let i = 0; i < accounts.length; i++) {
            const account = accounts[i];
            const info = this.safeValue (account, 'info');
            const subtype = this.safeString (info, 'subtype', undefined);
            const typeFromAccount = this.safeString (account, 'type');
            if (type === 'margin') {
                if (subtype === marketId) {
                    return this.safeString (account, 'id');
                }
            } else if (type === typeFromAccount) {
                return this.safeString (account, 'id');
            }
        }
        const defaultAccount = this.safeValue (accounts, 0, {});
        return this.safeString (defaultAccount, 'id');
    }

    /**
     * @method
     * @name htx#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://huobiapi.github.io/docs/spot/v1/en/#apiv2-currency-amp-chains
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies (params = {}): Promise<Currencies> {
        const response = await this.spotPublicGetV2ReferenceCurrencies (params);
        //
        //    {
        //        "code": 200,
        //        "data": [
        //            {
        //                "currency": "sxp",
        //                "assetType": "1",
        //                "chains": [
        //                    {
        //                        "chain": "sxp",
        //                        "displayName": "ERC20",
        //                        "baseChain": "ETH",
        //                        "baseChainProtocol": "ERC20",
        //                        "isDynamic": true,
        //                        "numOfConfirmations": "12",
        //                        "numOfFastConfirmations": "12",
        //                        "depositStatus": "allowed",
        //                        "minDepositAmt": "0.23",
        //                        "withdrawStatus": "allowed",
        //                        "minWithdrawAmt": "0.23",
        //                        "withdrawPrecision": "8",
        //                        "maxWithdrawAmt": "227000.000000000000000000",
        //                        "withdrawQuotaPerDay": "227000.000000000000000000",
        //                        "withdrawQuotaPerYear": null,
        //                        "withdrawQuotaTotal": null,
        //                        "withdrawFeeType": "fixed",
        //                        "transactFeeWithdraw": "11.1654",
        //                        "addrWithTag": false,
        //                        "addrDepositTag": false
        //                    }
        //                ],
        //                "instStatus": "normal"
        //            }
        //        ]
        //    }
        //
        const data = this.safeList (response, 'data', []);
        const result: Dict = {};
        this.options['networkChainIdsByNames'] = {};
        this.options['networkNamesByChainIds'] = {};
        for (let i = 0; i < data.length; i++) {
            const entry = data[i];
            const currencyId = this.safeString (entry, 'currency');
            const code = this.safeCurrencyCode (currencyId);
            const assetType = this.safeString (entry, 'assetType');
            const type = assetType === '1' ? 'crypto' : 'fiat';
            this.options['networkChainIdsByNames'][code] = {};
            const chains = this.safeList (entry, 'chains', []);
            const networks: Dict = {};
            for (let j = 0; j < chains.length; j++) {
                const chainEntry = chains[j];
                const uniqueChainId = this.safeString (chainEntry, 'chain'); // i.e. usdterc20, trc20usdt ...
                const title = this.safeString2 (chainEntry, 'baseChain', 'displayName'); // baseChain and baseChainProtocol are together existent or inexistent in entries, but baseChain is preferred. when they are both inexistent, then we use generic displayName
                this.options['networkChainIdsByNames'][code][title] = uniqueChainId;
                this.options['networkNamesByChainIds'][uniqueChainId] = title;
                const networkCode = this.networkIdToCode (uniqueChainId);
                networks[networkCode] = {
                    'info': chainEntry,
                    'id': uniqueChainId,
                    'network': networkCode,
                    'limits': {
                        'deposit': {
                            'min': this.safeNumber (chainEntry, 'minDepositAmt'),
                            'max': undefined,
                        },
                        'withdraw': {
                            'min': this.safeNumber (chainEntry, 'minWithdrawAmt'),
                            'max': this.safeNumber (chainEntry, 'maxWithdrawAmt'),
                        },
                    },
                    'active': undefined,
                    'deposit': this.safeString (chainEntry, 'depositStatus') === 'allowed',
                    'withdraw': this.safeString (chainEntry, 'withdrawStatus') === 'allowed',
                    'fee': this.safeNumber (chainEntry, 'transactFeeWithdraw'),
                    'precision': this.parseNumber (this.parsePrecision (this.safeString (chainEntry, 'withdrawPrecision'))),
                };
            }
            result[code] = this.safeCurrencyStructure ({
                'info': entry,
                'code': code,
                'id': currencyId,
                'active': this.safeString (entry, 'instStatus') === 'normal',
                'deposit': undefined,
                'withdraw': undefined,
                'fee': undefined,
                'name': undefined,
                'type': type,
                'limits': {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'deposit': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'precision': undefined,
                'networks': networks,
            });
        }
        return result;
    }

    networkIdToCode (networkId: Str = undefined, currencyCode: Str = undefined) {
        // here network-id is provided as a pair of currency & chain (i.e. trc20usdt)
        const keys = Object.keys (this.options['networkNamesByChainIds']);
        const keysLength = keys.length;
        if (keysLength === 0) {
            throw new ExchangeError (this.id + ' networkIdToCode() - markets need to be loaded at first');
        }
        const networkTitle = this.safeValue (this.options['networkNamesByChainIds'], networkId, networkId);
        return super.networkIdToCode (networkTitle);
    }

    networkCodeToId (networkCode: string, currencyCode: Str = undefined) { // here network-id is provided as a pair of currency & chain (i.e. trc20usdt)
        if (currencyCode === undefined) {
            throw new ArgumentsRequired (this.id + ' networkCodeToId() requires a currencyCode argument');
        }
        const keys = Object.keys (this.options['networkChainIdsByNames']);
        const keysLength = keys.length;
        if (keysLength === 0) {
            throw new ExchangeError (this.id + ' networkCodeToId() - markets need to be loaded at first');
        }
        const uniqueNetworkIds = this.safeValue (this.options['networkChainIdsByNames'], currencyCode, {});
        if (networkCode in uniqueNetworkIds) {
            return uniqueNetworkIds[networkCode];
        } else {
            const networkTitle = super.networkCodeToId (networkCode);
            return this.safeValue (uniqueNetworkIds, networkTitle, networkTitle);
        }
    }

    /**
     * @method
     * @name htx#fetchBalance
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-account-balance-of-a-specific-account
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec4b429-7773-11ed-9966-0242ac110003
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=10000074-77b7-11ed-9966-0242ac110003
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-asset-valuation
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-user-s-account-information
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-query-user-s-account-information
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-query-user-39-s-account-information
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.unified] provide this parameter if you have a recent account with unified cross+isolated margin account
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchBalance', undefined, params);
        const options = this.safeValue (this.options, 'fetchBalance', {});
        const isUnifiedAccount = this.safeValue2 (params, 'isUnifiedAccount', 'unified', false);
        params = this.omit (params, [ 'isUnifiedAccount', 'unified' ]);
        const request: Dict = {};
        const spot = (type === 'spot');
        const future = (type === 'future');
        const defaultSubType = this.safeString2 (this.options, 'defaultSubType', 'subType', 'linear');
        let subType = this.safeString2 (options, 'defaultSubType', 'subType', defaultSubType);
        subType = this.safeString2 (params, 'defaultSubType', 'subType', subType);
        const inverse = (subType === 'inverse');
        const linear = (subType === 'linear');
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchBalance', params);
        params = this.omit (params, [ 'defaultSubType', 'subType' ]);
        const isolated = (marginMode === 'isolated');
        const cross = (marginMode === 'cross');
        const margin = (type === 'margin') || (spot && (cross || isolated));
        let response = undefined;
        if (spot || margin) {
            if (margin) {
                if (isolated) {
                    response = await this.spotPrivateGetV1MarginAccountsBalance (this.extend (request, params));
                } else {
                    response = await this.spotPrivateGetV1CrossMarginAccountsBalance (this.extend (request, params));
                }
            } else {
                await this.loadAccounts ();
                const accountId = await this.fetchAccountIdByType (type, undefined, undefined, params);
                request['account-id'] = accountId;
                response = await this.spotPrivateGetV1AccountAccountsAccountIdBalance (this.extend (request, params));
            }
        } else if (isUnifiedAccount) {
            response = await this.contractPrivateGetLinearSwapApiV3UnifiedAccountInfo (this.extend (request, params));
        } else if (linear) {
            if (isolated) {
                response = await this.contractPrivatePostLinearSwapApiV1SwapAccountInfo (this.extend (request, params));
            } else {
                response = await this.contractPrivatePostLinearSwapApiV1SwapCrossAccountInfo (this.extend (request, params));
            }
        } else if (inverse) {
            if (future) {
                response = await this.contractPrivatePostApiV1ContractAccountInfo (this.extend (request, params));
            } else {
                response = await this.contractPrivatePostSwapApiV1SwapAccountInfo (this.extend (request, params));
            }
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "id": 1528640,
        //             "type": "spot",
        //             "state": "working",
        //             "list": [
        //                 { "currency": "lun", "type": "trade", "balance": "0", "seq-num": "0" },
        //                 { "currency": "lun", "type": "frozen", "balance": "0", "seq-num": "0" },
        //                 { "currency": "ht", "type": "frozen", "balance": "0", "seq-num": "145" },
        //             ]
        //         },
        //         "ts":1637644827566
        //     }
        //
        // cross margin
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "id": 51015302,
        //             "type": "cross-margin",
        //             "state": "working",
        //             "risk-rate": "2",
        //             "acct-balance-sum": "100",
        //             "debt-balance-sum": "0",
        //             "list": [
        //                 { "currency": "usdt", "type": "trade", "balance": "100" },
        //                 { "currency": "usdt", "type": "frozen", "balance": "0" },
        //                 { "currency": "usdt", "type": "loan-available", "balance": "200" },
        //                 { "currency": "usdt", "type": "transfer-out-available", "balance": "-1" },
        //                 { "currency": "ht", "type": "loan-available", "balance": "36.60724091" },
        //                 { "currency": "ht", "type": "transfer-out-available", "balance": "-1" },
        //                 { "currency": "btc", "type": "trade", "balance": "1168.533000000000000000" },
        //                 { "currency": "btc", "type": "frozen", "balance": "0.000000000000000000" },
        //                 { "currency": "btc", "type": "loan", "balance": "-2.433000000000000000" },
        //                 { "currency": "btc", "type": "interest", "balance": "-0.000533000000000000" },
        //                 { "currency": "btc", "type": "transfer-out-available", "balance": "1163.872174670000000000" },
        //                 { "currency": "btc", "type": "loan-available", "balance": "8161.876538350676000000" }
        //             ]
        //         },
        //         "code": 200
        //     }
        //
        // isolated margin
        //
        //     {
        //         "data": [
        //             {
        //                 "id": 18264,
        //                 "type": "margin",
        //                 "state": "working",
        //                 "symbol": "btcusdt",
        //                 "fl-price": "0",
        //                 "fl-type": "safe",
        //                 "risk-rate": "475.952571086994250554",
        //                 "list": [
        //                     { "currency": "btc","type": "trade","balance": "1168.533000000000000000" },
        //                     { "currency": "btc","type": "frozen","balance": "0.000000000000000000" },
        //                     { "currency": "btc","type": "loan","balance": "-2.433000000000000000" },
        //                     { "currency": "btc","type": "interest","balance": "-0.000533000000000000" },
        //                     { "currency": "btc","type": "transfer-out-available", "balance": "1163.872174670000000000" },
        //                     { "currency": "btc","type": "loan-available", "balance": "8161.876538350676000000" }
        //                 ]
        //             }
        //         ]
        //     }
        //
        // future, swap isolated
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "symbol": "BTC",
        //                 "margin_balance": 0,
        //                 "margin_position": 0E-18,
        //                 "margin_frozen": 0,
        //                 "margin_available": 0E-18,
        //                 "profit_real": 0,
        //                 "profit_unreal": 0,
        //                 "risk_rate": null,
        //                 "withdraw_available": 0,
        //                 "liquidation_price": null,
        //                 "lever_rate": 5,
        //                 "adjust_factor": 0.025000000000000000,
        //                 "margin_static": 0,
        //                 "is_debit": 0, // future only
        //                 "contract_code": "BTC-USD", // swap only
        //                 "margin_asset": "USDT", // linear only
        //                 "margin_mode": "isolated", // linear only
        //                 "margin_account": "BTC-USDT" // linear only
        //                 "transfer_profit_ratio": null // inverse only
        //             },
        //         ],
        //         "ts": 1637644827566
        //     }
        //
        // linear cross futures and linear cross swap
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "futures_contract_detail": [
        //                     {
        //                         "symbol": "ETH",
        //                         "contract_code": "ETH-USDT-220325",
        //                         "margin_position": 0,
        //                         "margin_frozen": 0,
        //                         "margin_available": 200.000000000000000000,
        //                         "profit_unreal": 0E-18,
        //                         "liquidation_price": null,
        //                         "lever_rate": 5,
        //                         "adjust_factor": 0.060000000000000000,
        //                         "contract_type": "quarter",
        //                         "pair": "ETH-USDT",
        //                         "business_type": "futures"
        //                     },
        //                 ],
        //                 "margin_mode": "cross",
        //                 "margin_account": "USDT",
        //                 "margin_asset": "USDT",
        //                 "margin_balance": 49.874186030200000000,
        //                 "money_in": 50,
        //                 "money_out": 0,
        //                 "margin_static": 49.872786030200000000,
        //                 "margin_position": 6.180000000000000000,
        //                 "margin_frozen": 6.000000000000000000,
        //                 "profit_unreal": 0.001400000000000000,
        //                 "withdraw_available": 37.6927860302,
        //                 "risk_rate": 271.984050521072796934,
        //                 "new_risk_rate": 0.001858676950514399,
        //                 "contract_detail": [
        //                     {
        //                         "symbol": "MANA",
        //                         "contract_code": "MANA-USDT",
        //                         "margin_position": 0,
        //                         "margin_frozen": 0,
        //                         "margin_available": 200.000000000000000000,
        //                         "profit_unreal": 0E-18,
        //                         "liquidation_price": null,
        //                         "lever_rate": 5,
        //                         "adjust_factor": 0.100000000000000000,
        //                         "contract_type": "swap",
        //                         "pair": "MANA-USDT",
        //                         "business_type": "swap"
        //                     },
        //                 ]
        //             }
        //         ],
        //         "ts": 1640915104870
        //     }
        //
        // TODO add balance parsing for linear swap
        //
        let result: Dict = { 'info': response } as any;
        const data = this.safeValue (response, 'data');
        if (spot || margin) {
            if (isolated) {
                for (let i = 0; i < data.length; i++) {
                    const entry = data[i];
                    const symbol = this.safeSymbol (this.safeString (entry, 'symbol'));
                    const balances = this.safeValue (entry, 'list');
                    const subResult: Dict = {};
                    for (let j = 0; j < balances.length; j++) {
                        const balance = balances[j];
                        const currencyId = this.safeString (balance, 'currency');
                        const code = this.safeCurrencyCode (currencyId);
                        subResult[code] = this.parseMarginBalanceHelper (balance, code, subResult);
                    }
                    result[symbol] = this.safeBalance (subResult);
                }
            } else {
                const balances = this.safeValue (data, 'list', []);
                for (let i = 0; i < balances.length; i++) {
                    const balance = balances[i];
                    const currencyId = this.safeString (balance, 'currency');
                    const code = this.safeCurrencyCode (currencyId);
                    result[code] = this.parseMarginBalanceHelper (balance, code, result);
                }
                result = this.safeBalance (result);
            }
        } else if (isUnifiedAccount) {
            for (let i = 0; i < data.length; i++) {
                const entry = data[i];
                const marginAsset = this.safeString (entry, 'margin_asset');
                const currencyCode = this.safeCurrencyCode (marginAsset);
                if (isolated) {
                    const isolated_swap = this.safeValue (entry, 'isolated_swap', {});
                    for (let j = 0; j < isolated_swap.length; j++) {
                        const balance = isolated_swap[j];
                        const marketId = this.safeString (balance, 'contract_code');
                        const subBalance: Dict = {
                            'code': currencyCode,
                            'free': this.safeNumber (balance, 'margin_available'),
                        };
                        const symbol = this.safeSymbol (marketId);
                        result[symbol] = subBalance;
                        result = this.safeBalance (result);
                    }
                } else {
                    const account = this.account ();
                    account['free'] = this.safeString (entry, 'margin_static');
                    account['used'] = this.safeString (entry, 'margin_frozen');
                    result[currencyCode] = account;
                    result = this.safeBalance (result);
                }
            }
        } else if (linear) {
            const first = this.safeValue (data, 0, {});
            if (isolated) {
                for (let i = 0; i < data.length; i++) {
                    const balance = data[i];
                    const marketId = this.safeString2 (balance, 'contract_code', 'margin_account');
                    const market = this.safeMarket (marketId);
                    const currencyId = this.safeString (balance, 'margin_asset');
                    const currency = this.safeCurrency (currencyId);
                    const code = this.safeString (market, 'settle', currency['code']);
                    // the exchange outputs positions for delisted markets
                    // https://www.huobi.com/support/en-us/detail/74882968522337
                    // we skip it if the market was delisted
                    if (code !== undefined) {
                        const account = this.account ();
                        account['free'] = this.safeString (balance, 'margin_balance');
                        account['used'] = this.safeString (balance, 'margin_frozen');
                        const accountsByCode: Dict = {};
                        accountsByCode[code] = account;
                        const symbol = market['symbol'];
                        result[symbol] = this.safeBalance (accountsByCode);
                    }
                }
            } else {
                const account = this.account ();
                account['free'] = this.safeString (first, 'withdraw_available');
                account['total'] = this.safeString (first, 'margin_balance');
                const currencyId = this.safeString2 (first, 'margin_asset', 'symbol');
                const code = this.safeCurrencyCode (currencyId);
                result[code] = account;
                result = this.safeBalance (result);
            }
        } else if (inverse) {
            for (let i = 0; i < data.length; i++) {
                const balance = data[i];
                const currencyId = this.safeString (balance, 'symbol');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['free'] = this.safeString (balance, 'margin_available');
                account['used'] = this.safeString (balance, 'margin_frozen');
                result[code] = account;
            }
            result = this.safeBalance (result);
        }
        return result as Balances;
    }

    /**
     * @method
     * @name htx#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-the-order-detail-of-an-order-based-on-client-order-id
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-the-order-detail-of-an-order
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-get-information-of-an-order
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-get-information-of-order
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-information-of-an-order
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-information-of-an-order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOrder', market, params);
        const request: Dict = {
            // spot -----------------------------------------------------------
            // 'order-id': 'id',
            // 'symbol': market['id'],
            // 'client-order-id': clientOrderId,
            // 'clientOrderId': clientOrderId,
            // contracts ------------------------------------------------------
            // 'order_id': id,
            // 'client_order_id': clientOrderId,
            // 'contract_code': market['id'],
            // 'pair': 'BTC-USDT',
            // 'contract_type': 'this_week', // swap, this_week, next_week, quarter, next_ quarter
        };
        let response = undefined;
        if (marketType === 'spot') {
            const clientOrderId = this.safeString (params, 'clientOrderId');
            if (clientOrderId !== undefined) {
                // will be filled below in extend ()
                // they expect clientOrderId instead of client-order-id
                // request['clientOrderId'] = clientOrderId;
                response = await this.spotPrivateGetV1OrderOrdersGetClientOrder (this.extend (request, params));
            } else {
                request['order-id'] = id;
                response = await this.spotPrivateGetV1OrderOrdersOrderId (this.extend (request, params));
            }
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
            }
            const clientOrderId = this.safeString2 (params, 'client_order_id', 'clientOrderId');
            if (clientOrderId === undefined) {
                request['order_id'] = id;
            } else {
                request['client_order_id'] = clientOrderId;
                params = this.omit (params, [ 'client_order_id', 'clientOrderId' ]);
            }
            request['contract_code'] = market['id'];
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('fetchOrder', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapOrderInfo (this.extend (request, params));
                } else if (marginMode === 'cross') {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapCrossOrderInfo (this.extend (request, params));
                }
            } else if (market['inverse']) {
                if (marketType === 'future') {
                    request['symbol'] = market['settleId'];
                    response = await this.contractPrivatePostApiV1ContractOrderInfo (this.extend (request, params));
                } else if (marketType === 'swap') {
                    response = await this.contractPrivatePostSwapApiV1SwapOrderInfo (this.extend (request, params));
                } else {
                    throw new NotSupported (this.id + ' fetchOrder() does not support ' + marketType + ' markets');
                }
            }
        }
        //
        // spot
        //
        //     {
        //         "status":"ok",
        //         "data":{
        //             "id":438398393065481,
        //             "symbol":"ethusdt",
        //             "account-id":1528640,
        //             "client-order-id":"AA03022abc2163433e-006b-480e-9ad1-d4781478c5e7",
        //             "amount":"0.100000000000000000",
        //             "price":"3000.000000000000000000",
        //             "created-at":1640549994642,
        //             "type":"buy-limit",
        //             "field-amount":"0.0",
        //             "field-cash-amount":"0.0",
        //             "field-fees":"0.0",
        //             "finished-at":0,
        //             "source":"spot-api",
        //             "state":"submitted",
        //             "canceled-at":0
        //         }
        //     }
        //
        // linear swap cross margin
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "business_type":"swap",
        //                 "contract_type":"swap",
        //                 "pair":"BTC-USDT",
        //                 "symbol":"BTC",
        //                 "contract_code":"BTC-USDT",
        //                 "volume":1,
        //                 "price":3000,
        //                 "order_price_type":"limit",
        //                 "order_type":1,
        //                 "direction":"buy",
        //                 "offset":"open",
        //                 "lever_rate":1,
        //                 "order_id":924912513206878210,
        //                 "client_order_id":null,
        //                 "created_at":1640557927189,
        //                 "trade_volume":0,
        //                 "trade_turnover":0,
        //                 "fee":0,
        //                 "trade_avg_price":null,
        //                 "margin_frozen":3.000000000000000000,
        //                 "profit":0,
        //                 "status":3,
        //                 "order_source":"api",
        //                 "order_id_str":"924912513206878210",
        //                 "fee_asset":"USDT",
        //                 "liquidation_type":"0",
        //                 "canceled_at":0,
        //                 "margin_asset":"USDT",
        //                 "margin_account":"USDT",
        //                 "margin_mode":"cross",
        //                 "is_tpsl":0,
        //                 "real_profit":0
        //             }
        //         ],
        //         "ts":1640557982556
        //     }
        //
        // linear swap isolated margin detail
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "symbol": "BTC",
        //             "contract_code": "BTC-USDT",
        //             "instrument_price": 0,
        //             "final_interest": 0,
        //             "adjust_value": 0,
        //             "lever_rate": 10,
        //             "direction": "sell",
        //             "offset": "open",
        //             "volume": 1.000000000000000000,
        //             "price": 13059.800000000000000000,
        //             "created_at": 1603703614712,
        //             "canceled_at": 0,
        //             "order_source": "api",
        //             "order_price_type": "opponent",
        //             "margin_frozen": 0,
        //             "profit": 0,
        //             "trades": [
        //                 {
        //                     "trade_id": 131560927,
        //                     "trade_price": 13059.800000000000000000,
        //                     "trade_volume": 1.000000000000000000,
        //                     "trade_turnover": 13.059800000000000000,
        //                     "trade_fee": -0.005223920000000000,
        //                     "created_at": 1603703614715,
        //                     "role": "taker",
        //                     "fee_asset": "USDT",
        //                     "profit": 0,
        //                     "real_profit": 0,
        //                     "id": "131560927-770334322963152896-1"
        //                 }
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 1,
        //             "liquidation_type": "0",
        //             "fee_asset": "USDT",
        //             "fee": -0.005223920000000000,
        //             "order_id": 770334322963152896,
        //             "order_id_str": "770334322963152896",
        //             "client_order_id": 57012021045,
        //             "order_type": "1",
        //             "status": 6,
        //             "trade_avg_price": 13059.800000000000000000,
        //             "trade_turnover": 13.059800000000000000,
        //             "trade_volume": 1.000000000000000000,
        //             "margin_asset": "USDT",
        //             "margin_mode": "isolated",
        //             "margin_account": "BTC-USDT",
        //             "real_profit": 0,
        //             "is_tpsl": 0
        //         },
        //         "ts": 1603703678477
        //     }
        let order = this.safeValue (response, 'data');
        if (Array.isArray (order)) {
            order = this.safeValue (order, 0);
        }
        return this.parseOrder (order);
    }

    parseMarginBalanceHelper (balance, code, result) {
        let account = undefined;
        if (code in result) {
            account = result[code];
        } else {
            account = this.account ();
        }
        if (balance['type'] === 'trade') {
            account['free'] = this.safeString (balance, 'balance');
        }
        if (balance['type'] === 'frozen') {
            account['used'] = this.safeString (balance, 'balance');
        }
        return account;
    }

    async fetchSpotOrdersByStates (states, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        const method = this.safeString (this.options, 'fetchOrdersByStatesMethod', 'spot_private_get_v1_order_orders'); // spot_private_get_v1_order_history
        if (method === 'spot_private_get_v1_order_orders') {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
            }
        }
        await this.loadMarkets ();
        let market = undefined;
        let request: Dict = {
            // spot_private_get_v1_order_orders GET /v1/order/orders ----------
            // 'symbol': market['id'], // required
            // 'types': 'buy-market,sell-market,buy-limit,sell-limit,buy-ioc,sell-ioc,buy-stop-limit,sell-stop-limit,buy-limit-fok,sell-limit-fok,buy-stop-limit-fok,sell-stop-limit-fok',
            // 'start-time': since, // max window of 48h within a range of 180 days, within past 2 hours for cancelled orders
            // 'end-time': this.milliseconds (),
            'states': states, // filled, partial-canceled, canceled
            // 'from': order['id'],
            // 'direct': 'next', // next, prev, used with from
            // 'size': 100, // max 100
            // spot_private_get_v1_order_history GET /v1/order/history --------
            // 'symbol': market['id'], // optional
            // 'start-time': since, // max window of 48h within a range of 180 days, within past 2 hours for cancelled orders
            // 'end-time': this.milliseconds (),
            // 'direct': 'next', // next, prev, used with from
            // 'size': 100, // max 100
        };
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['start-time'] = since; // a window of 48 hours within 180 days
            request['end-time'] = this.sum (since, 48 * 60 * 60 * 1000);
        }
        [ request, params ] = this.handleUntilOption ('end-time', request, params);
        if (limit !== undefined) {
            request['size'] = limit;
        }
        let response = undefined;
        if (method === 'spot_private_get_v1_order_orders') {
            response = await this.spotPrivateGetV1OrderOrders (this.extend (request, params));
        } else {
            response = await this.spotPrivateGetV1OrderHistory (this.extend (request, params));
        }
        //
        // spot_private_get_v1_order_orders GET /v1/order/orders
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "id": 13997833014,
        //                 "symbol": "ethbtc",
        //                 "account-id": 3398321,
        //                 "client-order-id": "23456",
        //                 "amount": "0.045000000000000000",
        //                 "price": "0.034014000000000000",
        //                 "created-at": 1545836976871,
        //                 "type": "sell-limit",
        //                 "field-amount": "0.045000000000000000",
        //                 "field-cash-amount": "0.001530630000000000",
        //                 "field-fees": "0.000003061260000000",
        //                 "finished-at": 1545837948214,
        //                 "source": "spot-api",
        //                 "state": "filled",
        //                 "canceled-at": 0
        //             }
        //         ]
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseOrders (data, market, since, limit);
    }

    async fetchSpotOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        return await this.fetchSpotOrdersByStates ('pre-submitted,submitted,partial-filled,filled,partial-canceled,canceled', symbol, since, limit, params);
    }

    async fetchClosedSpotOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        return await this.fetchSpotOrdersByStates ('filled,partial-canceled,canceled', symbol, since, limit, params);
    }

    async fetchContractOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchContractOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request: Dict = {
            // POST /api/v1/contract_hisorders inverse futures ----------------
            // 'symbol': market['settleId'], // BTC, ETH, ...
            // 'order_type': '1', // 1 limit，3 opponent，4 lightning, 5 trigger order, 6 pst_only, 7 optimal_5, 8 optimal_10, 9 optimal_20, 10 fok, 11 ioc
            // POST /swap-api/v3/swap_hisorders inverse swap ------------------
            // POST /linear-swap-api/v3/swap_hisorders linear isolated --------
            // POST /linear-swap-api/v3/swap_cross_hisorders linear cross -----
            'trade_type': 0, // 0:All; 1: Open long; 2: Open short; 3: Close short; 4: Close long; 5: Liquidate long positions; 6: Liquidate short positions, 17:buy(one-way mode), 18:sell(one-way mode)
            'status': '0', // support multiple query seperated by ',',such as '3,4,5', 0: all. 3. Have sumbmitted the orders; 4. Orders partially matched; 5. Orders cancelled with partially matched; 6. Orders fully matched; 7. Orders cancelled;
        };
        let response = undefined;
        const trigger = this.safeBool2 (params, 'stop', 'trigger');
        const stopLossTakeProfit = this.safeValue (params, 'stopLossTakeProfit');
        const trailing = this.safeBool (params, 'trailing', false);
        params = this.omit (params, [ 'stop', 'stopLossTakeProfit', 'trailing', 'trigger' ]);
        if (trigger || stopLossTakeProfit || trailing) {
            if (limit !== undefined) {
                request['page_size'] = limit;
            }
            request['contract_code'] = market['id'];
            request['create_date'] = 90;
        } else {
            if (since !== undefined) {
                request['start_time'] = since; // max 90 days back
                // request['end_time'] = since + 172800000; // 48 hours window
            }
            request['contract'] = market['id'];
            request['type'] = 1; // 1:All Orders,2:Order in Finished Status
        }
        [ request, params ] = this.handleUntilOption ('end_time', request, params);
        if (market['linear']) {
            let marginMode = undefined;
            [ marginMode, params ] = this.handleMarginModeAndParams ('fetchContractOrders', params);
            marginMode = (marginMode === undefined) ? 'cross' : marginMode;
            if (marginMode === 'isolated') {
                if (trigger) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerHisorders (this.extend (request, params));
                } else if (stopLossTakeProfit) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapTpslHisorders (this.extend (request, params));
                } else if (trailing) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapTrackHisorders (this.extend (request, params));
                } else {
                    response = await this.contractPrivatePostLinearSwapApiV3SwapHisorders (this.extend (request, params));
                }
            } else if (marginMode === 'cross') {
                if (trigger) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerHisorders (this.extend (request, params));
                } else if (stopLossTakeProfit) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslHisorders (this.extend (request, params));
                } else if (trailing) {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTrackHisorders (this.extend (request, params));
                } else {
                    response = await this.contractPrivatePostLinearSwapApiV3SwapCrossHisorders (this.extend (request, params));
                }
            }
        } else if (market['inverse']) {
            if (market['swap']) {
                if (trigger) {
                    response = await this.contractPrivatePostSwapApiV1SwapTriggerHisorders (this.extend (request, params));
                } else if (stopLossTakeProfit) {
                    response = await this.contractPrivatePostSwapApiV1SwapTpslHisorders (this.extend (request, params));
                } else if (trailing) {
                    response = await this.contractPrivatePostSwapApiV1SwapTrackHisorders (this.extend (request, params));
                } else {
                    response = await this.contractPrivatePostSwapApiV3SwapHisorders (this.extend (request, params));
                }
            } else if (market['future']) {
                request['symbol'] = market['settleId'];
                if (trigger) {
                    response = await this.contractPrivatePostApiV1ContractTriggerHisorders (this.extend (request, params));
                } else if (stopLossTakeProfit) {
                    response = await this.contractPrivatePostApiV1ContractTpslHisorders (this.extend (request, params));
                } else if (trailing) {
                    response = await this.contractPrivatePostApiV1ContractTrackHisorders (this.extend (request, params));
                } else {
                    response = await this.contractPrivatePostApiV3ContractHisorders (this.extend (request, params));
                }
            }
        }
        //
        // future and swap
        //
        //     {
        //         "code": 200,
        //         "msg": "ok",
        //         "data": [
        //             {
        //                 "direction": "buy",
        //                 "offset": "open",
        //                 "volume": 1.000000000000000000,
        //                 "price": 25000.000000000000000000,
        //                 "profit": 0E-18,
        //                 "pair": "BTC-USDT",
        //                 "query_id": 47403349100,
        //                 "order_id": 1103683465337593856,
        //                 "contract_code": "BTC-USDT-230505",
        //                 "symbol": "BTC",
        //                 "lever_rate": 5,
        //                 "create_date": 1683180243577,
        //                 "order_source": "web",
        //                 "canceled_source": "web",
        //                 "order_price_type": 1,
        //                 "order_type": 1,
        //                 "margin_frozen": 0E-18,
        //                 "trade_volume": 0E-18,
        //                 "trade_turnover": 0E-18,
        //                 "fee": 0E-18,
        //                 "trade_avg_price": 0,
        //                 "status": 7,
        //                 "order_id_str": "1103683465337593856",
        //                 "fee_asset": "USDT",
        //                 "fee_amount": 0,
        //                 "fee_quote_amount": 0,
        //                 "liquidation_type": "0",
        //                 "margin_asset": "USDT",
        //                 "margin_mode": "cross",
        //                 "margin_account": "USDT",
        //                 "update_time": 1683180352034,
        //                 "is_tpsl": 0,
        //                 "real_profit": 0,
        //                 "trade_partition": "USDT",
        //                 "reduce_only": 0,
        //                 "contract_type": "this_week",
        //                 "business_type": "futures"
        //             }
        //         ],
        //         "ts": 1683239909141
        //     }
        //
        // trigger
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "contract_type": "swap",
        //                     "business_type": "swap",
        //                     "pair": "BTC-USDT",
        //                     "symbol": "BTC",
        //                     "contract_code": "BTC-USDT",
        //                     "trigger_type": "le",
        //                     "volume": 1.000000000000000000,
        //                     "order_type": 1,
        //                     "direction": "buy",
        //                     "offset": "open",
        //                     "lever_rate": 1,
        //                     "order_id": 1103670703588327424,
        //                     "order_id_str": "1103670703588327424",
        //                     "relation_order_id": "-1",
        //                     "order_price_type": "limit",
        //                     "status": 6,
        //                     "order_source": "web",
        //                     "trigger_price": 25000.000000000000000000,
        //                     "triggered_price": null,
        //                     "order_price": 24000.000000000000000000,
        //                     "created_at": 1683177200945,
        //                     "triggered_at": null,
        //                     "order_insert_at": 0,
        //                     "canceled_at": 1683179075234,
        //                     "fail_code": null,
        //                     "fail_reason": null,
        //                     "margin_mode": "cross",
        //                     "margin_account": "USDT",
        //                     "update_time": 1683179075958,
        //                     "trade_partition": "USDT",
        //                     "reduce_only": 0
        //                 },
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 2
        //         },
        //         "ts": 1683239702792
        //     }
        //
        // stop-loss and take-profit
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "contract_type": "swap",
        //                     "business_type": "swap",
        //                     "pair": "BTC-USDT",
        //                     "symbol": "BTC",
        //                     "contract_code": "BTC-USDT",
        //                     "margin_mode": "cross",
        //                     "margin_account": "USDT",
        //                     "volume": 1.000000000000000000,
        //                     "order_type": 1,
        //                     "tpsl_order_type": "sl",
        //                     "direction": "sell",
        //                     "order_id": 1103680386844839936,
        //                     "order_id_str": "1103680386844839936",
        //                     "order_source": "web",
        //                     "trigger_type": "le",
        //                     "trigger_price": 25000.000000000000000000,
        //                     "created_at": 1683179509613,
        //                     "order_price_type": "market",
        //                     "status": 11,
        //                     "source_order_id": null,
        //                     "relation_tpsl_order_id": "-1",
        //                     "canceled_at": 0,
        //                     "fail_code": null,
        //                     "fail_reason": null,
        //                     "triggered_price": null,
        //                     "relation_order_id": "-1",
        //                     "update_time": 1683179968231,
        //                     "order_price": 0E-18,
        //                     "trade_partition": "USDT"
        //                 },
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 2
        //         },
        //         "ts": 1683229230233
        //     }
        //
        let orders = this.safeValue (response, 'data');
        if (!Array.isArray (orders)) {
            orders = this.safeValue (orders, 'orders', []);
        }
        return this.parseOrders (orders, market, since, limit);
    }

    async fetchClosedContractOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        const request: Dict = {
            'status': '5,6,7', // comma separated, 0 all, 3 submitted orders, 4 partially matched, 5 partially cancelled, 6 fully matched and closed, 7 canceled
        };
        return await this.fetchContractOrders (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name htx#fetchOrders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-past-orders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-historical-orders-within-48-hours
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-get-history-orders-new
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-get-history-orders-new
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-history-orders-new
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-history-orders-via-multiple-fields-new
     * @description fetches information on multiple orders made by the user
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.trigger] *contract only* if the orders are trigger trigger orders or not
     * @param {bool} [params.stopLossTakeProfit] *contract only* if the orders are stop-loss or take-profit orders
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.trailing] *contract only* set to true if you want to fetch trailing stop orders
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOrders', market, params);
        const contract = (marketType === 'swap') || (marketType === 'future');
        if (contract && (symbol === undefined)) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument for ' + marketType + ' orders');
        }
        if (contract) {
            return await this.fetchContractOrders (symbol, since, limit, params);
        } else {
            return await this.fetchSpotOrders (symbol, since, limit, params);
        }
    }

    /**
     * @method
     * @name htx#fetchClosedOrders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-past-orders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-historical-orders-within-48-hours
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-get-history-orders-new
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-get-history-orders-new
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-history-orders-new
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-history-orders-via-multiple-fields-new
     * @description fetches information on multiple closed orders made by the user
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchClosedOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchClosedOrders', symbol, since, limit, params, 100) as Order[];
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchClosedOrders', market, params);
        if (marketType === 'spot') {
            return await this.fetchClosedSpotOrders (symbol, since, limit, params);
        } else {
            return await this.fetchClosedContractOrders (symbol, since, limit, params);
        }
    }

    /**
     * @method
     * @name htx#fetchOpenOrders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-open-orders
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-current-unfilled-order-acquisition
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-current-unfilled-order-acquisition
     * @description fetch all unfilled currently open orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of open order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.trigger] *contract only* if the orders are trigger trigger orders or not
     * @param {bool} [params.stopLossTakeProfit] *contract only* if the orders are stop-loss or take-profit orders
     * @param {boolean} [params.trailing] *contract only* set to true if you want to fetch trailing stop orders
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        const request: Dict = {};
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchOpenOrders', market, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchOpenOrders', market, params, 'linear');
        let response = undefined;
        if (marketType === 'spot') {
            if (symbol !== undefined) {
                request['symbol'] = market['id'];
            }
            // todo replace with fetchAccountIdByType
            let accountId = this.safeString (params, 'account-id');
            if (accountId === undefined) {
                // pick the first account
                await this.loadAccounts ();
                for (let i = 0; i < this.accounts.length; i++) {
                    const account = this.accounts[i];
                    if (this.safeString (account, 'type') === 'spot') {
                        accountId = this.safeString (account, 'id');
                        if (accountId !== undefined) {
                            break;
                        }
                    }
                }
            }
            request['account-id'] = accountId;
            if (limit !== undefined) {
                request['size'] = limit;
            }
            params = this.omit (params, 'account-id');
            response = await this.spotPrivateGetV1OrderOpenOrders (this.extend (request, params));
        } else {
            if (symbol !== undefined) {
                // throw new ArgumentsRequired (this.id + ' fetchOpenOrders() requires a symbol argument');
                request['contract_code'] = market['id'];
            }
            if (limit !== undefined) {
                request['page_size'] = limit;
            }
            const trigger = this.safeBool2 (params, 'stop', 'trigger');
            const stopLossTakeProfit = this.safeValue (params, 'stopLossTakeProfit');
            const trailing = this.safeBool (params, 'trailing', false);
            params = this.omit (params, [ 'stop', 'stopLossTakeProfit', 'trailing', 'trigger' ]);
            if (subType === 'linear') {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('fetchOpenOrders', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerOpenorders (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTpslOpenorders (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTrackOpenorders (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapOpenorders (this.extend (request, params));
                    }
                } else if (marginMode === 'cross') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerOpenorders (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslOpenorders (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTrackOpenorders (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossOpenorders (this.extend (request, params));
                    }
                }
            } else if (subType === 'inverse') {
                if (marketType === 'swap') {
                    if (trigger) {
                        response = await this.contractPrivatePostSwapApiV1SwapTriggerOpenorders (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostSwapApiV1SwapTpslOpenorders (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostSwapApiV1SwapTrackOpenorders (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostSwapApiV1SwapOpenorders (this.extend (request, params));
                    }
                } else if (marketType === 'future') {
                    request['symbol'] = this.safeString (market, 'settleId', 'usdt');
                    if (trigger) {
                        response = await this.contractPrivatePostApiV1ContractTriggerOpenorders (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostApiV1ContractTpslOpenorders (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostApiV1ContractTrackOpenorders (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostApiV1ContractOpenorders (this.extend (request, params));
                    }
                }
            }
        }
        //
        // spot
        //
        //     {
        //         "status":"ok",
        //         "data":[
        //             {
        //                 "symbol":"ethusdt",
        //                 "source":"api",
        //                 "amount":"0.010000000000000000",
        //                 "account-id":1528640,
        //                 "created-at":1561597491963,
        //                 "price":"400.000000000000000000",
        //                 "filled-amount":"0.0",
        //                 "filled-cash-amount":"0.0",
        //                 "filled-fees":"0.0",
        //                 "id":38477101630,
        //                 "state":"submitted",
        //                 "type":"sell-limit"
        //             }
        //         ]
        //     }
        //
        // futures
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "symbol": "ADA",
        //                     "contract_code": "ADA201225",
        //                     "contract_type": "quarter",
        //                     "volume": 1,
        //                     "price": 0.0925,
        //                     "order_price_type": "post_only",
        //                     "order_type": 1,
        //                     "direction": "buy",
        //                     "offset": "close",
        //                     "lever_rate": 20,
        //                     "order_id": 773131315209248768,
        //                     "client_order_id": null,
        //                     "created_at": 1604370469629,
        //                     "trade_volume": 0,
        //                     "trade_turnover": 0,
        //                     "fee": 0,
        //                     "trade_avg_price": null,
        //                     "margin_frozen": 0,
        //                     "profit": 0,
        //                     "status": 3,
        //                     "order_source": "web",
        //                     "order_id_str": "773131315209248768",
        //                     "fee_asset": "ADA",
        //                     "liquidation_type": null,
        //                     "canceled_at": null,
        //                     "is_tpsl": 0,
        //                     "update_time": 1606975980467,
        //                     "real_profit": 0
        //                 }
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 1
        //         },
        //         "ts": 1604370488518
        //     }
        //
        // trigger
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "contract_type": "swap",
        //                     "business_type": "swap",
        //                     "pair": "BTC-USDT",
        //                     "symbol": "BTC",
        //                     "contract_code": "BTC-USDT",
        //                     "trigger_type": "le",
        //                     "volume": 1.000000000000000000,
        //                     "order_type": 1,
        //                     "direction": "buy",
        //                     "offset": "open",
        //                     "lever_rate": 1,
        //                     "order_id": 1103670703588327424,
        //                     "order_id_str": "1103670703588327424",
        //                     "order_source": "web",
        //                     "trigger_price": 25000.000000000000000000,
        //                     "order_price": 24000.000000000000000000,
        //                     "created_at": 1683177200945,
        //                     "order_price_type": "limit",
        //                     "status": 2,
        //                     "margin_mode": "cross",
        //                     "margin_account": "USDT",
        //                     "trade_partition": "USDT",
        //                     "reduce_only": 0
        //                 }
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 1
        //         },
        //         "ts": 1683177805320
        //     }
        //
        // stop-loss and take-profit
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "contract_type": "swap",
        //                     "business_type": "swap",
        //                     "pair": "BTC-USDT",
        //                     "symbol": "BTC",
        //                     "contract_code": "BTC-USDT",
        //                     "margin_mode": "cross",
        //                     "margin_account": "USDT",
        //                     "volume": 1.000000000000000000,
        //                     "order_type": 1,
        //                     "direction": "sell",
        //                     "order_id": 1103680386844839936,
        //                     "order_id_str": "1103680386844839936",
        //                     "order_source": "web",
        //                     "trigger_type": "le",
        //                     "trigger_price": 25000.000000000000000000,
        //                     "order_price": 0E-18,
        //                     "created_at": 1683179509613,
        //                     "order_price_type": "market",
        //                     "status": 2,
        //                     "tpsl_order_type": "sl",
        //                     "source_order_id": null,
        //                     "relation_tpsl_order_id": "-1",
        //                     "trade_partition": "USDT"
        //                 }
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 1
        //         },
        //         "ts": 1683179527011
        //     }
        //
        // trailing
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "orders": [
        //                 {
        //                     "contract_type": "swap",
        //                     "business_type": "swap",
        //                     "pair": "BTC-USDT",
        //                     "symbol": "BTC",
        //                     "contract_code": "BTC-USDT",
        //                     "volume": 1.000000000000000000,
        //                     "order_type": 1,
        //                     "direction": "sell",
        //                     "offset": "close",
        //                     "lever_rate": 1,
        //                     "order_id": 1192021437253877761,
        //                     "order_id_str": "1192021437253877761",
        //                     "order_source": "api",
        //                     "created_at": 1704241657328,
        //                     "order_price_type": "formula_price",
        //                     "status": 2,
        //                     "callback_rate": 0.050000000000000000,
        //                     "active_price": 50000.000000000000000000,
        //                     "is_active": 0,
        //                     "margin_mode": "cross",
        //                     "margin_account": "USDT",
        //                     "trade_partition": "USDT",
        //                     "reduce_only": 1
        //                 },
        //             ],
        //             "total_page": 1,
        //             "current_page": 1,
        //             "total_size": 2
        //         },
        //         "ts": 1704242440106
        //     }
        //
        let orders = this.safeValue (response, 'data');
        if (!Array.isArray (orders)) {
            orders = this.safeValue (orders, 'orders', []);
        }
        return this.parseOrders (orders, market, since, limit);
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            // spot
            'partial-filled': 'open',
            'partial-canceled': 'canceled',
            'filled': 'closed',
            'canceled': 'canceled',
            'submitted': 'open',
            'created': 'open',  // For stop orders
            // contract
            '1': 'open',
            '2': 'open',
            '3': 'open',
            '4': 'open',
            '5': 'canceled', // partially matched
            '6': 'closed',
            '7': 'canceled',
            '11': 'canceling',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // spot
        //
        //     {
        //         "id":  13997833014,
        //         "symbol": "ethbtc",
        //         "account-id":  3398321,
        //         "amount": "0.045000000000000000",
        //         "price": "0.034014000000000000",
        //         "created-at":  1545836976871,
        //         "type": "sell-limit",
        //         "field-amount": "0.045000000000000000", // they have fixed it for filled-amount
        //         "field-cash-amount": "0.001530630000000000", // they have fixed it for filled-cash-amount
        //         "field-fees": "0.000003061260000000", // they have fixed it for filled-fees
        //         "finished-at":  1545837948214,
        //         "source": "spot-api",
        //         "state": "filled",
        //         "canceled-at":  0
        //     }
        //
        //     {
        //         "id":  20395337822,
        //         "symbol": "ethbtc",
        //         "account-id":  5685075,
        //         "amount": "0.001000000000000000",
        //         "price": "0.0",
        //         "created-at":  1545831584023,
        //         "type": "buy-market",
        //         "field-amount": "0.029100000000000000", // they have fixed it for filled-amount
        //         "field-cash-amount": "0.000999788700000000", // they have fixed it for filled-cash-amount
        //         "field-fees": "0.000058200000000000", // they have fixed it for filled-fees
        //         "finished-at":  1545831584181,
        //         "source": "spot-api",
        //         "state": "filled",
        //         "canceled-at":  0
        //     }
        //
        // linear swap cross margin createOrder
        //
        //     {
        //         "order_id":924660854912552960,
        //         "order_id_str":"924660854912552960"
        //     }
        //
        // contracts fetchOrder
        //
        //     {
        //         "business_type":"swap",
        //         "contract_type":"swap",
        //         "pair":"BTC-USDT",
        //         "symbol":"BTC",
        //         "contract_code":"BTC-USDT",
        //         "volume":1,
        //         "price":3000,
        //         "order_price_type":"limit",
        //         "order_type":1,
        //         "direction":"buy",
        //         "offset":"open",
        //         "lever_rate":1,
        //         "order_id":924912513206878210,
        //         "client_order_id":null,
        //         "created_at":1640557927189,
        //         "trade_volume":0,
        //         "trade_turnover":0,
        //         "fee":0,
        //         "trade_avg_price":null,
        //         "margin_frozen":3.000000000000000000,
        //         "profit":0,
        //         "status":3,
        //         "order_source":"api",
        //         "order_id_str":"924912513206878210",
        //         "fee_asset":"USDT",
        //         "liquidation_type":"0",
        //         "canceled_at":0,
        //         "margin_asset":"USDT",
        //         "margin_account":"USDT",
        //         "margin_mode":"cross",
        //         "is_tpsl":0,
        //         "real_profit":0
        //     }
        //
        // contracts fetchOrder detailed
        //
        //     {
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "instrument_price": 0,
        //         "final_interest": 0,
        //         "adjust_value": 0,
        //         "lever_rate": 10,
        //         "direction": "sell",
        //         "offset": "open",
        //         "volume": 1.000000000000000000,
        //         "price": 13059.800000000000000000,
        //         "created_at": 1603703614712,
        //         "canceled_at": 0,
        //         "order_source": "api",
        //         "order_price_type": "opponent",
        //         "margin_frozen": 0,
        //         "profit": 0,
        //         "trades": [
        //             {
        //                 "trade_id": 131560927,
        //                 "trade_price": 13059.800000000000000000,
        //                 "trade_volume": 1.000000000000000000,
        //                 "trade_turnover": 13.059800000000000000,
        //                 "trade_fee": -0.005223920000000000,
        //                 "created_at": 1603703614715,
        //                 "role": "taker",
        //                 "fee_asset": "USDT",
        //                 "profit": 0,
        //                 "real_profit": 0,
        //                 "id": "131560927-770334322963152896-1"
        //             }
        //         ],
        //         "total_page": 1,
        //         "current_page": 1,
        //         "total_size": 1,
        //         "liquidation_type": "0",
        //         "fee_asset": "USDT",
        //         "fee": -0.005223920000000000,
        //         "order_id": 770334322963152896,
        //         "order_id_str": "770334322963152896",
        //         "client_order_id": 57012021045,
        //         "order_type": "1",
        //         "status": 6,
        //         "trade_avg_price": 13059.800000000000000000,
        //         "trade_turnover": 13.059800000000000000,
        //         "trade_volume": 1.000000000000000000,
        //         "margin_asset": "USDT",
        //         "margin_mode": "isolated",
        //         "margin_account": "BTC-USDT",
        //         "real_profit": 0,
        //         "is_tpsl": 0
        //     }
        //
        // future and swap: fetchOrders
        //
        //     {
        //         "order_id": 773131315209248768,
        //         "contract_code": "ADA201225",
        //         "symbol": "ADA",
        //         "lever_rate": 20,
        //         "direction": "buy",
        //         "offset": "close",
        //         "volume": 1,
        //         "price": 0.0925,
        //         "create_date": 1604370469629,
        //         "update_time": 1603704221118,
        //         "order_source": "web",
        //         "order_price_type": 6,
        //         "order_type": 1,
        //         "margin_frozen": 0,
        //         "profit": 0,
        //         "contract_type": "quarter",
        //         "trade_volume": 0,
        //         "trade_turnover": 0,
        //         "fee": 0,
        //         "trade_avg_price": 0,
        //         "status": 3,
        //         "order_id_str": "773131315209248768",
        //         "fee_asset": "ADA",
        //         "liquidation_type": "0",
        //         "is_tpsl": 0,
        //         "real_profit": 0
        //         "margin_asset": "USDT",
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "trade_partition": "USDT", // only in isolated & cross of linear
        //         "reduce_only": "1", // only in isolated & cross of linear
        //         "contract_type": "quarter", // only in cross-margin (inverse & linear)
        //         "pair": "BTC-USDT", // only in cross-margin (inverse & linear)
        //         "business_type": "futures" // only in cross-margin (inverse & linear)
        //     }
        //
        // trigger: fetchOpenOrders
        //
        //     {
        //         "contract_type": "swap",
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "trigger_type": "le",
        //         "volume": 1.000000000000000000,
        //         "order_type": 1,
        //         "direction": "buy",
        //         "offset": "open",
        //         "lever_rate": 1,
        //         "order_id": 1103670703588327424,
        //         "order_id_str": "1103670703588327424",
        //         "order_source": "web",
        //         "trigger_price": 25000.000000000000000000,
        //         "order_price": 24000.000000000000000000,
        //         "created_at": 1683177200945,
        //         "order_price_type": "limit",
        //         "status": 2,
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "trade_partition": "USDT",
        //         "reduce_only": 0
        //     }
        //
        // stop-loss and take-profit: fetchOpenOrders
        //
        //     {
        //         "contract_type": "swap",
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "volume": 1.000000000000000000,
        //         "order_type": 1,
        //         "direction": "sell",
        //         "order_id": 1103680386844839936,
        //         "order_id_str": "1103680386844839936",
        //         "order_source": "web",
        //         "trigger_type": "le",
        //         "trigger_price": 25000.000000000000000000,
        //         "order_price": 0E-18,
        //         "created_at": 1683179509613,
        //         "order_price_type": "market",
        //         "status": 2,
        //         "tpsl_order_type": "sl",
        //         "source_order_id": null,
        //         "relation_tpsl_order_id": "-1",
        //         "trade_partition": "USDT"
        //     }
        //
        // trailing: fetchOpenOrders
        //
        //     {
        //         "contract_type": "swap",
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "volume": 1.000000000000000000,
        //         "order_type": 1,
        //         "direction": "sell",
        //         "offset": "close",
        //         "lever_rate": 1,
        //         "order_id": 1192021437253877761,
        //         "order_id_str": "1192021437253877761",
        //         "order_source": "api",
        //         "created_at": 1704241657328,
        //         "order_price_type": "formula_price",
        //         "status": 2,
        //         "callback_rate": 0.050000000000000000,
        //         "active_price": 50000.000000000000000000,
        //         "is_active": 0,
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "trade_partition": "USDT",
        //         "reduce_only": 1
        //     }
        //
        // trigger: fetchOrders
        //
        //     {
        //         "contract_type": "swap",
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "trigger_type": "le",
        //         "volume": 1.000000000000000000,
        //         "order_type": 1,
        //         "direction": "buy",
        //         "offset": "open",
        //         "lever_rate": 1,
        //         "order_id": 1103670703588327424,
        //         "order_id_str": "1103670703588327424",
        //         "relation_order_id": "-1",
        //         "order_price_type": "limit",
        //         "status": 6,
        //         "order_source": "web",
        //         "trigger_price": 25000.000000000000000000,
        //         "triggered_price": null,
        //         "order_price": 24000.000000000000000000,
        //         "created_at": 1683177200945,
        //         "triggered_at": null,
        //         "order_insert_at": 0,
        //         "canceled_at": 1683179075234,
        //         "fail_code": null,
        //         "fail_reason": null,
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "update_time": 1683179075958,
        //         "trade_partition": "USDT",
        //         "reduce_only": 0
        //     }
        //
        // stop-loss and take-profit: fetchOrders
        //
        //     {
        //         "contract_type": "swap",
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USDT",
        //         "margin_mode": "cross",
        //         "margin_account": "USDT",
        //         "volume": 1.000000000000000000,
        //         "order_type": 1,
        //         "tpsl_order_type": "sl",
        //         "direction": "sell",
        //         "order_id": 1103680386844839936,
        //         "order_id_str": "1103680386844839936",
        //         "order_source": "web",
        //         "trigger_type": "le",
        //         "trigger_price": 25000.000000000000000000,
        //         "created_at": 1683179509613,
        //         "order_price_type": "market",
        //         "status": 11,
        //         "source_order_id": null,
        //         "relation_tpsl_order_id": "-1",
        //         "canceled_at": 0,
        //         "fail_code": null,
        //         "fail_reason": null,
        //         "triggered_price": null,
        //         "relation_order_id": "-1",
        //         "update_time": 1683179968231,
        //         "order_price": 0E-18,
        //         "trade_partition": "USDT"
        //     }
        //
        // spot: createOrders
        //
        //     [
        //         {
        //             "order-id": 936847569789079,
        //             "client-order-id": "AA03022abc3a55e82c-0087-4fc2-beac-112fdebb1ee9"
        //         },
        //         {
        //             "client-order-id": "AA03022abcdb3baefb-3cfa-4891-8009-082b3d46ca82",
        //             "err-code": "account-frozen-balance-insufficient-error",
        //             "err-msg": "trade account balance is not enough, left: `89`"
        //         }
        //     ]
        //
        // swap and future: createOrders
        //
        //     [
        //         {
        //             "index": 2,
        //             "err_code": 1047,
        //             "err_msg": "Insufficient margin available."
        //         },
        //         {
        //             "order_id": 1172923090632953857,
        //             "index": 1,
        //             "order_id_str": "1172923090632953857"
        //         }
        //     ]
        //
        const rejectedCreateOrders = this.safeString2 (order, 'err_code', 'err-code');
        let status = this.parseOrderStatus (this.safeString2 (order, 'state', 'status'));
        if (rejectedCreateOrders !== undefined) {
            status = 'rejected';
        }
        const id = this.safeStringN (order, [ 'id', 'order_id_str', 'order-id' ]);
        let side = this.safeString (order, 'direction');
        let type = this.safeString (order, 'order_price_type');
        if ('type' in order) {
            const orderType = order['type'].split ('-');
            side = orderType[0];
            type = orderType[1];
        }
        const marketId = this.safeString2 (order, 'contract_code', 'symbol');
        market = this.safeMarket (marketId, market);
        const timestamp = this.safeIntegerN (order, [ 'created_at', 'created-at', 'create_date' ]);
        const clientOrderId = this.safeString2 (order, 'client_order_id', 'client-or' + 'der-id'); // transpiler regex trick for php issue
        let cost = undefined;
        let amount = undefined;
        if ((type !== undefined) && (type.indexOf ('market') >= 0)) {
            cost = this.safeString (order, 'field-cash-amount');
        } else {
            amount = this.safeString2 (order, 'volume', 'amount');
            cost = this.safeStringN (order, [ 'filled-cash-amount', 'field-cash-amount', 'trade_turnover' ]); // same typo here
        }
        const filled = this.safeStringN (order, [ 'filled-amount', 'field-amount', 'trade_volume' ]); // typo in their API, filled amount
        const price = this.safeString2 (order, 'price', 'order_price');
        let feeCost = this.safeString2 (order, 'filled-fees', 'field-fees'); // typo in their API, filled feeSide
        feeCost = this.safeString (order, 'fee', feeCost);
        let fee = undefined;
        if (feeCost !== undefined) {
            let feeCurrency = undefined;
            const feeCurrencyId = this.safeString (order, 'fee_asset');
            if (feeCurrencyId !== undefined) {
                feeCurrency = this.safeCurrencyCode (feeCurrencyId);
            } else {
                feeCurrency = (side === 'sell') ? market['quote'] : market['base'];
            }
            fee = {
                'cost': feeCost,
                'currency': feeCurrency,
            };
        }
        const average = this.safeString (order, 'trade_avg_price');
        const trades = this.safeValue (order, 'trades');
        const reduceOnlyInteger = this.safeInteger (order, 'reduce_only');
        let reduceOnly = undefined;
        if (reduceOnlyInteger !== undefined) {
            reduceOnly = (reduceOnlyInteger === 0) ? false : true;
        }
        return this.safeOrder ({
            'info': order,
            'id': id,
            'clientOrderId': clientOrderId,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': undefined,
            'symbol': market['symbol'],
            'type': type,
            'timeInForce': undefined,
            'postOnly': undefined,
            'side': side,
            'price': price,
            'triggerPrice': this.safeString2 (order, 'stop-price', 'trigger_price'),
            'average': average,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'reduceOnly': reduceOnly,
            'fee': fee,
            'trades': trades,
        }, market);
    }

    /**
     * @method
     * @name htx#createMarketBuyOrderWithCost
     * @description create a market buy order by providing the symbol and cost
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec4ee16-7773-11ed-9966-0242ac110003
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketBuyOrderWithCost (symbol: string, cost: number, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' createMarketBuyOrderWithCost() supports spot orders only');
        }
        params['createMarketBuyOrderRequiresPrice'] = false;
        return await this.createOrder (symbol, 'market', 'buy', cost, undefined, params);
    }

    /**
     * @method
     * @name htx#createTrailingPercentOrder
     * @description create a trailing order by providing the symbol, type, side, amount, price and trailingPercent
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much you want to trade in units of the base currency, or number of contracts
     * @param {float} [price] the price for the order to be filled at, in units of the quote currency, ignored in market orders
     * @param {float} trailingPercent the percent to trail away from the current market price
     * @param {float} trailingTriggerPrice the price to activate a trailing order, default uses the price argument
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createTrailingPercentOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, trailingPercent = undefined, trailingTriggerPrice = undefined, params = {}): Promise<Order> {
        if (trailingPercent === undefined) {
            throw new ArgumentsRequired (this.id + ' createTrailingPercentOrder() requires a trailingPercent argument');
        }
        if (trailingTriggerPrice === undefined) {
            throw new ArgumentsRequired (this.id + ' createTrailingPercentOrder() requires a trailingTriggerPrice argument');
        }
        params['trailingPercent'] = trailingPercent;
        params['trailingTriggerPrice'] = trailingTriggerPrice;
        return await this.createOrder (symbol, type, side, amount, price, params);
    }

    /**
     * @method
     * @ignore
     * @name htx#createSpotOrderRequest
     * @description helper function to build request
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much you want to trade in units of the base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.timeInForce] supports 'IOC' and 'FOK'
     * @param {float} [params.cost] the quote quantity that can be used as an alternative for the amount for market buy orders
     * @returns {object} request to be sent to the exchange
     */
    async createSpotOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        await this.loadAccounts ();
        const market = this.market (symbol);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('createOrder', params);
        const accountId = await this.fetchAccountIdByType (market['type'], marginMode, symbol);
        const request: Dict = {
            // spot -----------------------------------------------------------
            'account-id': accountId,
            'symbol': market['id'],
            // 'type': side + '-' + type, // buy-market, sell-market, buy-limit, sell-limit, buy-ioc, sell-ioc, buy-limit-maker, sell-limit-maker, buy-stop-limit, sell-stop-limit, buy-limit-fok, sell-limit-fok, buy-stop-limit-fok, sell-stop-limit-fok
            // 'amount': this.amountToPrecision (symbol, amount), // for buy market orders it's the order cost
            // 'price': this.priceToPrecision (symbol, price),
            // 'source': 'spot-api', // optional, spot-api, margin-api = isolated margin, super-margin-api = cross margin, c2c-margin-api
            // 'client-order-id': clientOrderId, // optional, max 64 chars, must be unique within 8 hours
            // 'stop-price': this.priceToPrecision (symbol, stopPrice), // trigger price for stop limit orders
            // 'operator': 'gte', // gte, lte, trigger price condition
        };
        let orderType = type.replace ('buy-', '');
        orderType = orderType.replace ('sell-', '');
        const options = this.safeValue (this.options, market['type'], {});
        const triggerPrice = this.safeStringN (params, [ 'triggerPrice', 'stopPrice', 'stop-price' ]);
        if (triggerPrice === undefined) {
            const stopOrderTypes = this.safeValue (options, 'stopOrderTypes', {});
            if (orderType in stopOrderTypes) {
                throw new ArgumentsRequired (this.id + ' createOrder() requires a triggerPrice for a trigger order');
            }
        } else {
            const defaultOperator = (side === 'sell') ? 'lte' : 'gte';
            const stopOperator = this.safeString (params, 'operator', defaultOperator);
            request['stop-price'] = this.priceToPrecision (symbol, triggerPrice);
            request['operator'] = stopOperator;
            if ((orderType === 'limit') || (orderType === 'limit-fok')) {
                orderType = 'stop-' + orderType;
            } else if ((orderType !== 'stop-limit') && (orderType !== 'stop-limit-fok')) {
                throw new NotSupported (this.id + ' createOrder() does not support ' + type + ' orders');
            }
        }
        let postOnly = undefined;
        [ postOnly, params ] = this.handlePostOnly (orderType === 'market', orderType === 'limit-maker', params);
        if (postOnly) {
            orderType = 'limit-maker';
        }
        const timeInForce = this.safeString (params, 'timeInForce', 'GTC');
        if (timeInForce === 'FOK') {
            orderType = orderType + '-fok';
        } else if (timeInForce === 'IOC') {
            orderType = 'ioc';
        }
        request['type'] = side + '-' + orderType;
        const clientOrderId = this.safeString2 (params, 'clientOrderId', 'client-order-id'); // must be 64 chars max and unique within 24 hours
        if (clientOrderId === undefined) {
            const broker = this.safeValue (this.options, 'broker', {});
            const brokerId = this.safeString (broker, 'id');
            request['client-order-id'] = brokerId + this.uuid ();
        } else {
            request['client-order-id'] = clientOrderId;
        }
        if (marginMode === 'cross') {
            request['source'] = 'super-margin-api';
        } else if (marginMode === 'isolated') {
            request['source'] = 'margin-api';
        } else if (marginMode === 'c2c') {
            request['source'] = 'c2c-margin-api';
        }
        if ((orderType === 'market') && (side === 'buy')) {
            let quoteAmount = undefined;
            let createMarketBuyOrderRequiresPrice = true;
            [ createMarketBuyOrderRequiresPrice, params ] = this.handleOptionAndParams (params, 'createOrder', 'createMarketBuyOrderRequiresPrice', true);
            const cost = this.safeNumber (params, 'cost');
            params = this.omit (params, 'cost');
            if (cost !== undefined) {
                quoteAmount = this.amountToPrecision (symbol, cost);
            } else if (createMarketBuyOrderRequiresPrice) {
                if (price === undefined) {
                    throw new InvalidOrder (this.id + ' createOrder() requires the price argument for market buy orders to calculate the total cost to spend (amount * price), alternatively set the createMarketBuyOrderRequiresPrice option or param to false and pass the cost to spend in the amount argument');
                } else {
                    // despite that cost = amount * price is in quote currency and should have quote precision
                    // the exchange API requires the cost supplied in 'amount' to be of base precision
                    // more about it here:
                    // https://github.com/ccxt/ccxt/pull/4395
                    // https://github.com/ccxt/ccxt/issues/7611
                    // we use amountToPrecision here because the exchange requires cost in base precision
                    const amountString = this.numberToString (amount);
                    const priceString = this.numberToString (price);
                    quoteAmount = this.amountToPrecision (symbol, Precise.stringMul (amountString, priceString));
                }
            } else {
                quoteAmount = this.amountToPrecision (symbol, amount);
            }
            request['amount'] = quoteAmount;
        } else {
            request['amount'] = this.amountToPrecision (symbol, amount);
        }
        const limitOrderTypes = this.safeValue (options, 'limitOrderTypes', {});
        if (orderType in limitOrderTypes) {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        params = this.omit (params, [ 'triggerPrice', 'stopPrice', 'stop-price', 'clientOrderId', 'client-order-id', 'operator', 'timeInForce' ]);
        return this.extend (request, params);
    }

    createContractOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @ignore
         * @name htx#createContractOrderRequest
         * @description helper function to build request
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @param {string} [params.timeInForce] supports 'IOC' and 'FOK'
         * @param {float} [params.trailingPercent] *contract only* the percent to trail away from the current market price
         * @param {float} [params.trailingTriggerPrice] *contract only* the price to trigger a trailing order, default uses the price argument
         * @returns {object} request to be sent to the exchange
         */
        const market = this.market (symbol);
        const request: Dict = {
            'contract_code': market['id'],
            'volume': this.amountToPrecision (symbol, amount),
            'direction': side,
        };
        let postOnly = undefined;
        [ postOnly, params ] = this.handlePostOnly (type === 'market', type === 'post_only', params);
        if (postOnly) {
            type = 'post_only';
        }
        const timeInForce = this.safeString (params, 'timeInForce', 'GTC');
        if (timeInForce === 'FOK') {
            type = 'fok';
        } else if (timeInForce === 'IOC') {
            type = 'ioc';
        }
        const triggerPrice = this.safeNumberN (params, [ 'triggerPrice', 'stopPrice', 'trigger_price' ]);
        const stopLossTriggerPrice = this.safeNumber2 (params, 'stopLossPrice', 'sl_trigger_price');
        const takeProfitTriggerPrice = this.safeNumber2 (params, 'takeProfitPrice', 'tp_trigger_price');
        const trailingPercent = this.safeString2 (params, 'trailingPercent', 'callback_rate');
        const trailingTriggerPrice = this.safeNumber (params, 'trailingTriggerPrice', price);
        const isTrailingPercentOrder = trailingPercent !== undefined;
        const isTrigger = triggerPrice !== undefined;
        const isStopLossTriggerOrder = stopLossTriggerPrice !== undefined;
        const isTakeProfitTriggerOrder = takeProfitTriggerPrice !== undefined;
        if (isTrigger) {
            const triggerType = this.safeString2 (params, 'triggerType', 'trigger_type', 'le');
            request['trigger_type'] = triggerType;
            request['trigger_price'] = this.priceToPrecision (symbol, triggerPrice);
            if (price !== undefined) {
                request['order_price'] = this.priceToPrecision (symbol, price);
            }
        } else if (isStopLossTriggerOrder || isTakeProfitTriggerOrder) {
            if (isStopLossTriggerOrder) {
                request['sl_order_price_type'] = type;
                request['sl_trigger_price'] = this.priceToPrecision (symbol, stopLossTriggerPrice);
                if (price !== undefined) {
                    request['sl_order_price'] = this.priceToPrecision (symbol, price);
                }
            } else {
                request['tp_order_price_type'] = type;
                request['tp_trigger_price'] = this.priceToPrecision (symbol, takeProfitTriggerPrice);
                if (price !== undefined) {
                    request['tp_order_price'] = this.priceToPrecision (symbol, price);
                }
            }
        } else if (isTrailingPercentOrder) {
            const trailingPercentString = Precise.stringDiv (trailingPercent, '100');
            request['callback_rate'] = this.parseToNumeric (trailingPercentString);
            request['active_price'] = trailingTriggerPrice;
            request['order_price_type'] = this.safeString (params, 'order_price_type', 'formula_price');
        } else {
            const clientOrderId = this.safeInteger2 (params, 'client_order_id', 'clientOrderId');
            if (clientOrderId !== undefined) {
                request['client_order_id'] = clientOrderId;
                params = this.omit (params, [ 'clientOrderId' ]);
            }
            if (type === 'limit' || type === 'ioc' || type === 'fok' || type === 'post_only') {
                request['price'] = this.priceToPrecision (symbol, price);
            }
        }
        const reduceOnly = this.safeBool2 (params, 'reduceOnly', 'reduce_only', false);
        if (!isStopLossTriggerOrder && !isTakeProfitTriggerOrder) {
            if (reduceOnly) {
                request['reduce_only'] = 1;
            }
            request['lever_rate'] = this.safeIntegerN (params, [ 'leverRate', 'lever_rate', 'leverage' ], 1);
            if (!isTrailingPercentOrder) {
                request['order_price_type'] = type;
            }
        }
        const hedged = this.safeBool (params, 'hedged', false);
        if (hedged) {
            if (reduceOnly) {
                request['offset'] = 'close';
            } else {
                request['offset'] = 'open';
            }
        }
        const broker = this.safeValue (this.options, 'broker', {});
        const brokerId = this.safeString (broker, 'id');
        request['channel_code'] = brokerId;
        params = this.omit (params, [ 'reduceOnly', 'triggerPrice', 'stopPrice', 'stopLossPrice', 'takeProfitPrice', 'triggerType', 'leverRate', 'timeInForce', 'leverage', 'trailingPercent', 'trailingTriggerPrice', 'hedged' ]);
        return this.extend (request, params);
    }

    /**
     * @method
     * @name htx#createOrder
     * @description create a trade order
     * @see https://huobiapi.github.io/docs/spot/v1/en/#place-a-new-order                   // spot, margin
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#place-an-order        // coin-m swap
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#place-trigger-order   // coin-m swap trigger
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-place-an-order           // usdt-m swap cross
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-place-trigger-order      // usdt-m swap cross trigger
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-place-an-order        // usdt-m swap isolated
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-place-trigger-order   // usdt-m swap isolated trigger
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-set-a-take-profit-and-stop-loss-order-for-an-existing-position
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-set-a-take-profit-and-stop-loss-order-for-an-existing-position
     * @see https://huobiapi.github.io/docs/dm/v1/en/#place-an-order                        // coin-m futures
     * @see https://huobiapi.github.io/docs/dm/v1/en/#place-trigger-order                   // coin-m futures contract trigger
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much you want to trade in units of the base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {float} [params.triggerPrice] the price a trigger order is triggered at
     * @param {string} [params.triggerType] *contract trigger orders only* ge: greater than or equal to, le: less than or equal to
     * @param {float} [params.stopLossPrice] *contract only* the price a stop-loss order is triggered at
     * @param {float} [params.takeProfitPrice] *contract only* the price a take-profit order is triggered at
     * @param {string} [params.operator] *spot and margin only* gte or lte, trigger price condition
     * @param {string} [params.offset] *contract only* 'both' (linear only), 'open', or 'close', required in hedge mode and for inverse markets
     * @param {bool} [params.postOnly] *contract only* true or false
     * @param {int} [params.leverRate] *contract only* required for all contract orders except tpsl, leverage greater than 20x requires prior approval of high-leverage agreement
     * @param {string} [params.timeInForce] supports 'IOC' and 'FOK'
     * @param {float} [params.cost] *spot market buy only* the quote quantity that can be used as an alternative for the amount
     * @param {float} [params.trailingPercent] *contract only* the percent to trail away from the current market price
     * @param {float} [params.trailingTriggerPrice] *contract only* the price to trigger a trailing order, default uses the price argument
     * @param {bool} [params.hedged] *contract only* true for hedged mode, false for one way mode, default is false
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const triggerPrice = this.safeNumberN (params, [ 'triggerPrice', 'stopPrice', 'trigger_price' ]);
        const stopLossTriggerPrice = this.safeNumber2 (params, 'stopLossPrice', 'sl_trigger_price');
        const takeProfitTriggerPrice = this.safeNumber2 (params, 'takeProfitPrice', 'tp_trigger_price');
        const trailingPercent = this.safeNumber (params, 'trailingPercent');
        const isTrailingPercentOrder = trailingPercent !== undefined;
        const isTrigger = triggerPrice !== undefined;
        const isStopLossTriggerOrder = stopLossTriggerPrice !== undefined;
        const isTakeProfitTriggerOrder = takeProfitTriggerPrice !== undefined;
        let response = undefined;
        if (market['spot']) {
            if (isTrailingPercentOrder) {
                throw new NotSupported (this.id + ' createOrder() does not support trailing orders for spot markets');
            }
            const spotRequest = await this.createSpotOrderRequest (symbol, type, side, amount, price, params);
            response = await this.spotPrivatePostV1OrderOrdersPlace (spotRequest);
        } else {
            let contractRequest = this.createContractOrderRequest (symbol, type, side, amount, price, params);
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, contractRequest ] = this.handleMarginModeAndParams ('createOrder', contractRequest);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    if (isTrigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerOrder (contractRequest);
                    } else if (isStopLossTriggerOrder || isTakeProfitTriggerOrder) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTpslOrder (contractRequest);
                    } else if (isTrailingPercentOrder) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTrackOrder (contractRequest);
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapOrder (contractRequest);
                    }
                } else if (marginMode === 'cross') {
                    if (isTrigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerOrder (contractRequest);
                    } else if (isStopLossTriggerOrder || isTakeProfitTriggerOrder) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslOrder (contractRequest);
                    } else if (isTrailingPercentOrder) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTrackOrder (contractRequest);
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossOrder (contractRequest);
                    }
                }
            } else if (market['inverse']) {
                const offset = this.safeString (params, 'offset');
                if (offset === undefined) {
                    throw new ArgumentsRequired (this.id + ' createOrder () requires an extra parameter params["offset"] to be set to "open" or "close" when placing orders in inverse markets');
                }
                if (market['swap']) {
                    if (isTrigger) {
                        response = await this.contractPrivatePostSwapApiV1SwapTriggerOrder (contractRequest);
                    } else if (isStopLossTriggerOrder || isTakeProfitTriggerOrder) {
                        response = await this.contractPrivatePostSwapApiV1SwapTpslOrder (contractRequest);
                    } else if (isTrailingPercentOrder) {
                        response = await this.contractPrivatePostSwapApiV1SwapTrackOrder (contractRequest);
                    } else {
                        response = await this.contractPrivatePostSwapApiV1SwapOrder (contractRequest);
                    }
                } else if (market['future']) {
                    if (isTrigger) {
                        response = await this.contractPrivatePostApiV1ContractTriggerOrder (contractRequest);
                    } else if (isStopLossTriggerOrder || isTakeProfitTriggerOrder) {
                        response = await this.contractPrivatePostApiV1ContractTpslOrder (contractRequest);
                    } else if (isTrailingPercentOrder) {
                        response = await this.contractPrivatePostApiV1ContractTrackOrder (contractRequest);
                    } else {
                        response = await this.contractPrivatePostApiV1ContractOrder (contractRequest);
                    }
                }
            }
        }
        //
        // spot
        //
        //     {"status":"ok","data":"438398393065481"}
        //
        // swap and future
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "order_id": 924660854912552960,
        //             "order_id_str": "924660854912552960"
        //         },
        //         "ts": 1640497927185
        //     }
        //
        // stop-loss and take-profit
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "tp_order": {
        //                 "order_id": 1101494204040163328,
        //                 "order_id_str": "1101494204040163328"
        //             },
        //             "sl_order": null
        //         },
        //         "ts": :1682658283024
        //     }
        //
        let data = undefined;
        let result = undefined;
        if (market['spot']) {
            return this.safeOrder ({
                'info': response,
                'id': this.safeString (response, 'data'),
                'timestamp': undefined,
                'datetime': undefined,
                'lastTradeTimestamp': undefined,
                'status': undefined,
                'symbol': undefined,
                'type': type,
                'side': side,
                'price': price,
                'amount': amount,
                'filled': undefined,
                'remaining': undefined,
                'cost': undefined,
                'trades': undefined,
                'fee': undefined,
                'clientOrderId': undefined,
                'average': undefined,
            }, market);
        } else if (isStopLossTriggerOrder) {
            data = this.safeValue (response, 'data', {});
            result = this.safeValue (data, 'sl_order', {});
        } else if (isTakeProfitTriggerOrder) {
            data = this.safeValue (response, 'data', {});
            result = this.safeValue (data, 'tp_order', {});
        } else {
            result = this.safeValue (response, 'data', {});
        }
        return this.parseOrder (result, market);
    }

    /**
     * @method
     * @name htx#createOrders
     * @description create a list of trade orders
     * @see https://huobiapi.github.io/docs/spot/v1/en/#place-a-batch-of-orders
     * @see https://huobiapi.github.io/docs/dm/v1/en/#place-a-batch-of-orders
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#place-a-batch-of-orders
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-place-a-batch-of-orders
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-place-a-batch-of-orders
     * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrders (orders: OrderRequest[], params = {}) {
        await this.loadMarkets ();
        const ordersRequests = [];
        let symbol = undefined;
        let market = undefined;
        let marginMode = undefined;
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString (rawOrder, 'symbol');
            if (symbol === undefined) {
                symbol = marketId;
            } else {
                if (symbol !== marketId) {
                    throw new BadRequest (this.id + ' createOrders() requires all orders to have the same symbol');
                }
            }
            const type = this.safeString (rawOrder, 'type');
            const side = this.safeString (rawOrder, 'side');
            const amount = this.safeValue (rawOrder, 'amount');
            const price = this.safeValue (rawOrder, 'price');
            const orderParams = this.safeValue (rawOrder, 'params', {});
            const marginResult = this.handleMarginModeAndParams ('createOrders', orderParams);
            const currentMarginMode = marginResult[0];
            if (currentMarginMode !== undefined) {
                if (marginMode === undefined) {
                    marginMode = currentMarginMode;
                } else {
                    if (marginMode !== currentMarginMode) {
                        throw new BadRequest (this.id + ' createOrders() requires all orders to have the same margin mode (isolated or cross)');
                    }
                }
            }
            market = this.market (symbol);
            let orderRequest = undefined;
            if (market['spot']) {
                orderRequest = await this.createSpotOrderRequest (marketId, type, side, amount, price, orderParams);
            } else {
                orderRequest = this.createContractOrderRequest (marketId, type, side, amount, price, orderParams);
            }
            orderRequest = this.omit (orderRequest, 'marginMode');
            ordersRequests.push (orderRequest);
        }
        const request: Dict = {};
        let response = undefined;
        if (market['spot']) {
            response = await this.privatePostOrderBatchOrders (ordersRequests);
        } else {
            request['orders_data'] = ordersRequests;
            if (market['linear']) {
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapBatchorder (request);
                } else if (marginMode === 'cross') {
                    response = await this.contractPrivatePostLinearSwapApiV1SwapCrossBatchorder (request);
                }
            } else if (market['inverse']) {
                if (market['swap']) {
                    response = await this.contractPrivatePostSwapApiV1SwapBatchorder (request);
                } else if (market['future']) {
                    response = await this.contractPrivatePostApiV1ContractBatchorder (request);
                }
            }
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "order-id": 936847569789079,
        //                 "client-order-id": "AA03022abc3a55e82c-0087-4fc2-beac-112fdebb1ee9"
        //             },
        //             {
        //                 "client-order-id": "AA03022abcdb3baefb-3cfa-4891-8009-082b3d46ca82",
        //                 "err-code": "account-frozen-balance-insufficient-error",
        //                 "err-msg": "trade account balance is not enough, left: `89`"
        //             }
        //         ]
        //     }
        //
        // swap and future
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "errors": [
        //                 {
        //                     "index": 2,
        //                     "err_code": 1047,
        //                     "err_msg": "Insufficient margin available."
        //                 }
        //             ],
        //             "success": [
        //                 {
        //                     "order_id": 1172923090632953857,
        //                     "index": 1,
        //                     "order_id_str": "1172923090632953857"
        //                 }
        //             ]
        //         },
        //         "ts": 1699688256671
        //     }
        //
        let result = undefined;
        if (market['spot']) {
            result = this.safeValue (response, 'data', []);
        } else {
            const data = this.safeValue (response, 'data', {});
            const success = this.safeValue (data, 'success', []);
            const errors = this.safeValue (data, 'errors', []);
            result = this.arrayConcat (success, errors);
        }
        return this.parseOrders (result, market);
    }

    /**
     * @method
     * @name htx#cancelOrder
     * @description cancels an open order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.trigger] *contract only* if the order is a trigger trigger order or not
     * @param {boolean} [params.stopLossTakeProfit] *contract only* if the order is a stop-loss or take-profit order
     * @param {boolean} [params.trailing] *contract only* set to true if you want to cancel a trailing order
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('cancelOrder', market, params);
        const request: Dict = {
            // spot -----------------------------------------------------------
            // 'order-id': 'id',
            // 'symbol': market['id'],
            // 'client-order-id': clientOrderId,
            // contracts ------------------------------------------------------
            // 'order_id': id,
            // 'client_order_id': clientOrderId,
            // 'contract_code': market['id'],
            // 'pair': 'BTC-USDT',
            // 'contract_type': 'this_week', // swap, this_week, next_week, quarter, next_ quarter
        };
        let response = undefined;
        if (marketType === 'spot') {
            const clientOrderId = this.safeString2 (params, 'client-order-id', 'clientOrderId');
            if (clientOrderId === undefined) {
                request['order-id'] = id;
                response = await this.spotPrivatePostV1OrderOrdersOrderIdSubmitcancel (this.extend (request, params));
            } else {
                request['client-order-id'] = clientOrderId;
                params = this.omit (params, [ 'client-order-id', 'clientOrderId' ]);
                response = await this.spotPrivatePostV1OrderOrdersSubmitCancelClientOrder (this.extend (request, params));
            }
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
            }
            const clientOrderId = this.safeString2 (params, 'client_order_id', 'clientOrderId');
            if (clientOrderId === undefined) {
                request['order_id'] = id;
            } else {
                request['client_order_id'] = clientOrderId;
                params = this.omit (params, [ 'client_order_id', 'clientOrderId' ]);
            }
            if (market['future']) {
                request['symbol'] = market['settleId'];
            } else {
                request['contract_code'] = market['id'];
            }
            const trigger = this.safeBool2 (params, 'stop', 'trigger');
            const stopLossTakeProfit = this.safeValue (params, 'stopLossTakeProfit');
            const trailing = this.safeBool (params, 'trailing', false);
            params = this.omit (params, [ 'stop', 'stopLossTakeProfit', 'trailing', 'trigger' ]);
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('cancelOrder', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTpslCancel (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTrackCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCancel (this.extend (request, params));
                    }
                } else if (marginMode === 'cross') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslCancel (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTrackCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossCancel (this.extend (request, params));
                    }
                }
            } else if (market['inverse']) {
                if (market['swap']) {
                    if (trigger) {
                        response = await this.contractPrivatePostSwapApiV1SwapTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostSwapApiV1SwapTpslCancel (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostSwapApiV1SwapTrackCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostSwapApiV1SwapCancel (this.extend (request, params));
                    }
                } else if (market['future']) {
                    if (trigger) {
                        response = await this.contractPrivatePostApiV1ContractTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostApiV1ContractTpslCancel (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostApiV1ContractTrackCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostApiV1ContractCancel (this.extend (request, params));
                    }
                }
            } else {
                throw new NotSupported (this.id + ' cancelOrder() does not support ' + marketType + ' markets');
            }
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "data": "10138899000",
        //     }
        //
        // future and swap
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "errors": [],
        //             "successes": "924660854912552960"
        //         },
        //         "ts": 1640504486089
        //     }
        //
        return this.extend (this.parseOrder (response, market), {
            'id': id,
            'status': 'canceled',
        }) as Order;
    }

    /**
     * @method
     * @name htx#cancelOrders
     * @description cancel multiple orders
     * @param {string[]} ids order ids
     * @param {string} symbol unified market symbol, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.trigger] *contract only* if the orders are trigger trigger orders or not
     * @param {bool} [params.stopLossTakeProfit] *contract only* if the orders are stop-loss or take-profit orders
     * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrders (ids, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        let market: Market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('cancelOrders', market, params);
        const request: Dict = {
            // spot -----------------------------------------------------------
            // 'order-ids': ids.join (','), // max 50
            // 'client-order-ids': ids.join (','), // max 50
            // contracts ------------------------------------------------------
            // 'order_id': id, // comma separated, max 10
            // 'client_order_id': clientOrderId, // comma separated, max 10
            // 'contract_code': market['id'],
            // 'symbol': market['settleId'],
        };
        let response = undefined;
        if (marketType === 'spot') {
            let clientOrderIds = this.safeValue2 (params, 'client-order-id', 'clientOrderId');
            clientOrderIds = this.safeValue2 (params, 'client-order-ids', 'clientOrderIds', clientOrderIds);
            if (clientOrderIds === undefined) {
                if (typeof clientOrderIds === 'string') {
                    request['order-ids'] = [ ids ];
                } else {
                    request['order-ids'] = ids;
                }
            } else {
                if (typeof clientOrderIds === 'string') {
                    request['client-order-ids'] = [ clientOrderIds ];
                } else {
                    request['client-order-ids'] = clientOrderIds;
                }
                params = this.omit (params, [ 'client-order-id', 'client-order-ids', 'clientOrderId', 'clientOrderIds' ]);
            }
            response = await this.spotPrivatePostV1OrderOrdersBatchcancel (this.extend (request, params));
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' cancelOrders() requires a symbol argument');
            }
            let clientOrderIds = this.safeString2 (params, 'client_order_id', 'clientOrderId');
            clientOrderIds = this.safeString2 (params, 'client_order_ids', 'clientOrderIds', clientOrderIds);
            if (clientOrderIds === undefined) {
                request['order_id'] = ids.join (',');
            } else {
                request['client_order_id'] = clientOrderIds;
                params = this.omit (params, [ 'client_order_id', 'client_order_ids', 'clientOrderId', 'clientOrderIds' ]);
            }
            if (market['future']) {
                request['symbol'] = market['settleId'];
            } else {
                request['contract_code'] = market['id'];
            }
            const trigger = this.safeBool2 (params, 'stop', 'trigger');
            const stopLossTakeProfit = this.safeValue (params, 'stopLossTakeProfit');
            params = this.omit (params, [ 'stop', 'stopLossTakeProfit', 'trigger' ]);
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('cancelOrders', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTpslCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCancel (this.extend (request, params));
                    }
                } else if (marginMode === 'cross') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossCancel (this.extend (request, params));
                    }
                }
            } else if (market['inverse']) {
                if (market['swap']) {
                    if (trigger) {
                        response = await this.contractPrivatePostSwapApiV1SwapTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostSwapApiV1SwapTpslCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostSwapApiV1SwapCancel (this.extend (request, params));
                    }
                } else if (market['future']) {
                    if (trigger) {
                        response = await this.contractPrivatePostApiV1ContractTriggerCancel (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostApiV1ContractTpslCancel (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostApiV1ContractCancel (this.extend (request, params));
                    }
                }
            } else {
                throw new NotSupported (this.id + ' cancelOrders() does not support ' + marketType + ' markets');
            }
        }
        //
        // spot
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "success": [
        //                 "5983466"
        //             ],
        //             "failed": [
        //                 {
        //                     "err-msg": "Incorrect order state",
        //                     "order-state": 7,
        //                     "order-id": "",
        //                     "err-code": "order-orderstate-error",
        //                     "client-order-id": "first"
        //                 },
        //                 {
        //                     "err-msg": "Incorrect order state",
        //                     "order-state": 7,
        //                     "order-id": "",
        //                     "err-code": "order-orderstate-error",
        //                     "client-order-id": "second"
        //                 },
        //                 {
        //                     "err-msg": "The record is not found.",
        //                     "order-id": "",
        //                     "err-code": "base-not-found",
        //                     "client-order-id": "third"
        //                 }
        //             ]
        //         }
        //     }
        //
        // future and swap
        //
        //     {
        //         "status": "ok",
        //         "data": {
        //             "errors": [
        //                 {
        //                     "order_id": "769206471845261312",
        //                     "err_code": 1061,
        //                     "err_msg": "This order doesnt exist."
        //                 }
        //             ],
        //             "successes": "773120304138219520"
        //         },
        //         "ts": 1604367997451
        //     }
        //
        const data = this.safeDict (response, 'data');
        return this.parseCancelOrders (data);
    }

    parseCancelOrders (orders) {
        //
        //    {
        //        "success": [
        //            "5983466"
        //        ],
        //        "failed": [
        //            {
        //                "err-msg": "Incorrect order state",
        //                "order-state": 7,
        //                "order-id": "",
        //                "err-code": "order-orderstate-error",
        //                "client-order-id": "first"
        //            },
        //            ...
        //        ]
        //    }
        //
        //    {
        //        "errors": [
        //            {
        //                "order_id": "769206471845261312",
        //                "err_code": 1061,
        //                "err_msg": "This order doesnt exist."
        //            }
        //        ],
        //        "successes": "1258075374411399168,1258075393254871040"
        //    }
        //
        const successes = this.safeString (orders, 'successes');
        let success = undefined;
        if (successes !== undefined) {
            success = successes.split (',');
        } else {
            success = this.safeList (orders, 'success', []);
        }
        const failed = this.safeList2 (orders, 'errors', 'failed', []);
        const result = [];
        for (let i = 0; i < success.length; i++) {
            const order = success[i];
            result.push (this.safeOrder ({
                'info': order,
                'id': order,
                'status': 'canceled',
            }));
        }
        for (let i = 0; i < failed.length; i++) {
            const order = failed[i];
            result.push (this.safeOrder ({
                'info': order,
                'id': this.safeString2 (order, 'order-id', 'order_id'),
                'status': 'failed',
                'clientOrderId': this.safeString (order, 'client-order-id'),
            }));
        }
        return result;
    }

    /**
     * @method
     * @name htx#cancelAllOrders
     * @description cancel all open orders
     * @param {string} symbol unified market symbol, only orders in the market of this symbol are cancelled when symbol is not undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.trigger] *contract only* if the orders are trigger trigger orders or not
     * @param {boolean} [params.stopLossTakeProfit] *contract only* if the orders are stop-loss or take-profit orders
     * @param {boolean} [params.trailing] *contract only* set to true if you want to cancel all trailing orders
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelAllOrders (symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('cancelAllOrders', market, params);
        const request: Dict = {
            // spot -----------------------------------------------------------
            // 'account-id': account['id'],
            // 'symbol': market['id'], // a list of comma-separated symbols, all symbols by default
            // 'types' 'string', buy-market, sell-market, buy-limit, sell-limit, buy-ioc, sell-ioc, buy-stop-limit, sell-stop-limit, buy-limit-fok, sell-limit-fok, buy-stop-limit-fok, sell-stop-limit-fok
            // 'side': 'buy', // or 'sell'
            // 'size': 100, // the number of orders to cancel 1-100
            // contract -------------------------------------------------------
            // 'symbol': market['settleId'], // required
            // 'contract_code': market['id'],
            // 'contract_type': 'this_week', // swap, this_week, next_week, quarter, next_ quarter
            // 'direction': 'buy': // buy, sell
            // 'offset': 'open', // open, close
        };
        let response = undefined;
        if (marketType === 'spot') {
            if (symbol !== undefined) {
                request['symbol'] = market['id'];
            }
            response = await this.spotPrivatePostV1OrderOrdersBatchCancelOpenOrders (this.extend (request, params));
            //
            //     {
            //         "code": 200,
            //         "data": {
            //             "success-count": 2,
            //             "failed-count": 0,
            //             "next-id": 5454600
            //         }
            //     }
            //
            const data = this.safeDict (response, 'data');
            return [
                this.safeOrder ({
                    'info': data,
                }),
            ];
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' cancelAllOrders() requires a symbol argument');
            }
            if (market['future']) {
                request['symbol'] = market['settleId'];
            }
            request['contract_code'] = market['id'];
            const trigger = this.safeBool2 (params, 'stop', 'trigger');
            const stopLossTakeProfit = this.safeValue (params, 'stopLossTakeProfit');
            const trailing = this.safeBool (params, 'trailing', false);
            params = this.omit (params, [ 'stop', 'stopLossTakeProfit', 'trailing', 'trigger' ]);
            if (market['linear']) {
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('cancelAllOrders', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTriggerCancelall (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTpslCancelall (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapTrackCancelall (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCancelall (this.extend (request, params));
                    }
                } else if (marginMode === 'cross') {
                    if (trigger) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTriggerCancelall (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTpslCancelall (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossTrackCancelall (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostLinearSwapApiV1SwapCrossCancelall (this.extend (request, params));
                    }
                }
            } else if (market['inverse']) {
                if (market['swap']) {
                    if (trigger) {
                        response = await this.contractPrivatePostSwapApiV1SwapTriggerCancelall (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostSwapApiV1SwapTpslCancelall (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostSwapApiV1SwapTrackCancelall (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostSwapApiV1SwapCancelall (this.extend (request, params));
                    }
                } else if (market['future']) {
                    if (trigger) {
                        response = await this.contractPrivatePostApiV1ContractTriggerCancelall (this.extend (request, params));
                    } else if (stopLossTakeProfit) {
                        response = await this.contractPrivatePostApiV1ContractTpslCancelall (this.extend (request, params));
                    } else if (trailing) {
                        response = await this.contractPrivatePostApiV1ContractTrackCancelall (this.extend (request, params));
                    } else {
                        response = await this.contractPrivatePostApiV1ContractCancelall (this.extend (request, params));
                    }
                }
            } else {
                throw new NotSupported (this.id + ' cancelAllOrders() does not support ' + marketType + ' markets');
            }
            //
            //     {
            //         "status": "ok",
            //         "data": {
            //             "errors": [],
            //             "successes": "1104754904426696704"
            //         },
            //         "ts": "1683435723755"
            //     }
            //
            const data = this.safeDict (response, 'data');
            return this.parseCancelOrders (data) as Order[];
        }
    }

    /**
     * @method
     * @name htx#cancelAllOrdersAfter
     * @description dead man's switch, cancel all orders after the given timeout
     * @see https://huobiapi.github.io/docs/spot/v1/en/#dead-man-s-switch
     * @param {number} timeout time in milliseconds, 0 represents cancel the timer
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} the api result
     */
    async cancelAllOrdersAfter (timeout: Int, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {
            'timeout': (timeout > 0) ? this.parseToInt (timeout / 1000) : 0,
        };
        const response = await this.v2PrivatePostAlgoOrdersCancelAllAfter (this.extend (request, params));
        //
        //     {
        //         "code": 200,
        //         "message": "success",
        //         "data": {
        //             "currentTime": 1630491627230,
        //             "triggerTime": 1630491637230
        //         }
        //     }
        //
        return response;
    }

    parseDepositAddress (depositAddress, currency: Currency = undefined) {
        //
        //     {
        //         "currency": "usdt",
        //         "address": "0xf7292eb9ba7bc50358e27f0e025a4d225a64127b",
        //         "addressTag": "",
        //         "chain": "usdterc20", // trc20usdt, hrc20usdt, usdt, algousdt
        //     }
        //
        const address = this.safeString (depositAddress, 'address');
        const tag = this.safeString (depositAddress, 'addressTag');
        const currencyId = this.safeString (depositAddress, 'currency');
        currency = this.safeCurrency (currencyId, currency);
        const code = this.safeCurrencyCode (currencyId, currency);
        const note = this.safeString (depositAddress, 'note');
        const networkId = this.safeString (depositAddress, 'chain');
        this.checkAddress (address);
        return {
            'currency': code,
            'address': address,
            'tag': tag,
            'network': this.networkIdToCode (networkId),
            'note': note,
            'info': depositAddress,
        };
    }

    /**
     * @method
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec50029-7773-11ed-9966-0242ac110003
     * @name htx#fetchDepositAddressesByNetwork
     * @description fetch a dictionary of addresses for a currency, indexed by network
     * @param {string} code unified currency code of the currency for the deposit address
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [address structures]{@link https://docs.ccxt.com/#/?id=address-structure} indexed by the network
     */
    async fetchDepositAddressesByNetwork (code: string, params = {}): Promise<DepositAddress[]> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'currency': currency['id'],
        };
        const response = await this.spotPrivateGetV2AccountDepositAddress (this.extend (request, params));
        //
        //     {
        //         "code": 200,
        //         "data": [
        //             {
        //                 "currency": "eth",
        //                 "address": "0xf7292eb9ba7bc50358e27f0e025a4d225a64127b",
        //                 "addressTag": "",
        //                 "chain": "eth"
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const parsed = this.parseDepositAddresses (data, [ currency['code'] ], false);
        return this.indexBy (parsed, 'network') as DepositAddress[];
    }

    /**
     * @method
     * @name htx#fetchDepositAddress
     * @description fetch the deposit address for a currency associated with this account
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec50029-7773-11ed-9966-0242ac110003
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async fetchDepositAddress (code: string, params = {}): Promise<DepositAddress> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const [ networkCode, paramsOmited ] = this.handleNetworkCodeAndParams (params);
        const indexedAddresses = await this.fetchDepositAddressesByNetwork (code, paramsOmited);
        const selectedNetworkCode = this.selectNetworkCodeFromUnifiedNetworks (currency['code'], networkCode, indexedAddresses);
        return indexedAddresses[selectedNetworkCode] as DepositAddress;
    }

    async fetchWithdrawAddresses (code: string, note = undefined, networkCode = undefined, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'currency': currency['id'],
        };
        const response = await this.spotPrivateGetV2AccountWithdrawAddress (this.extend (request, params));
        //
        //     {
        //         "code": 200,
        //         "data": [
        //             {
        //                 "currency": "eth",
        //                 "chain": "eth"
        //                 "note": "Binance - TRC20",
        //                 "addressTag": "",
        //                 "address": "0xf7292eb9ba7bc50358e27f0e025a4d225a64127b",
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const allAddresses = this.parseDepositAddresses (data, [ currency['code'] ], false) as any; // cjg: to do remove this weird object or array ambiguity
        const addresses = [];
        for (let i = 0; i < allAddresses.length; i++) {
            const address = allAddresses[i];
            const noteMatch = (note === undefined) || (address['note'] === note);
            const networkMatch = (networkCode === undefined) || (address['network'] === networkCode);
            if (noteMatch && networkMatch) {
                addresses.push (address);
            }
        }
        return addresses;
    }

    /**
     * @method
     * @name htx#fetchDeposits
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec4f050-7773-11ed-9966-0242ac110003
     * @description fetch all deposits made to an account
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        if (limit === undefined || limit > 100) {
            limit = 100;
        }
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request: Dict = {
            'type': 'deposit',
            'direct': 'next',
            'from': 0, // From 'id' ... if you want to get results after a particular transaction id, pass the id in params.from
        };
        if (currency !== undefined) {
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['size'] = limit; // max 100
        }
        const response = await this.spotPrivateGetV1QueryDepositWithdraw (this.extend (request, params));
        //
        //    {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "id": "75115912",
        //                 "type": "deposit",
        //                 "sub-type": "NORMAL",
        //                 "request-id": "trc20usdt-a2e229a44ef2a948c874366230bb56aa73631cc0a03d177bd8b4c9d38262d7ff-200",
        //                 "currency": "usdt",
        //                 "chain": "trc20usdt",
        //                 "tx-hash": "a2e229a44ef2a948c874366230bb56aa73631cc0a03d177bd8b4c9d38262d7ff",
        //                 "amount": "12.000000000000000000",
        //                 "from-addr-tag": "",
        //                 "address-id": "0",
        //                 "address": "TRFTd1FxepQE6CnpwzUEMEbFaLm5bJK67s",
        //                 "address-tag": "",
        //                 "fee": "0",
        //                 "state": "safe",
        //                 "wallet-confirm": "2",
        //                 "created-at": "1621843808662",
        //                 "updated-at": "1621843857137"
        //             },
        //         ]
        //     }
        //
        return this.parseTransactions (response['data'], currency, since, limit);
    }

    /**
     * @method
     * @name htx#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-for-existed-withdraws-and-deposits
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        if (limit === undefined || limit > 100) {
            limit = 100;
        }
        await this.loadMarkets ();
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request: Dict = {
            'type': 'withdraw',
            'direct': 'next',
            'from': 0, // From 'id' ... if you want to get results after a particular transaction id, pass the id in params.from
        };
        if (currency !== undefined) {
            request['currency'] = currency['id'];
        }
        if (limit !== undefined) {
            request['size'] = limit; // max 100
        }
        const response = await this.spotPrivateGetV1QueryDepositWithdraw (this.extend (request, params));
        //
        //    {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "id": "61335312",
        //                 "type": "withdraw",
        //                 "sub-type": "NORMAL",
        //                 "currency": "usdt",
        //                 "chain": "trc20usdt",
        //                 "tx-hash": "30a3111f2fead74fae45c6218ca3150fc33cab2aa59cfe41526b96aae79ce4ec",
        //                 "amount": "12.000000000000000000",
        //                 "from-addr-tag": "",
        //                 "address-id": "27321591",
        //                 "address": "TRf5JacJQRsF4Nm2zu11W6maDGeiEWQu9e",
        //                 "address-tag": "",
        //                 "fee": "1.000000000000000000",
        //                 "state": "confirmed",
        //                 "created-at": "1621852316553",
        //                 "updated-at": "1621852467041"
        //             },
        //         ]
        //     }
        //
        return this.parseTransactions (response['data'], currency, since, limit);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        // fetchDeposits
        //
        //     {
        //         "id": "75115912",
        //         "type": "deposit",
        //         "sub-type": "NORMAL",
        //         "request-id": "trc20usdt-a2e229a44ef2a948c874366230bb56aa73631cc0a03d177bd8b4c9d38262d7ff-200",
        //         "currency": "usdt",
        //         "chain": "trc20usdt",
        //         "tx-hash": "a2e229a44ef2a948c874366230bb56aa73631cc0a03d177bd8b4c9d38262d7ff",
        //         "amount": "2849.000000000000000000",
        //         "from-addr-tag": "",
        //         "address-id": "0",
        //         "address": "TRFTd1FxepQE6CnpwzUEMEbFaLm5bJK67s",
        //         "address-tag": "",
        //         "fee": "0",
        //         "state": "safe",
        //         "wallet-confirm": "2",
        //         "created-at": "1621843808662",
        //         "updated-at": "1621843857137"
        //     },
        //
        // fetchWithdrawals
        //
        //     {
        //         "id": "61335312",
        //         "type": "withdraw",
        //         "sub-type": "NORMAL",
        //         "currency": "usdt",
        //         "chain": "trc20usdt",
        //         "tx-hash": "30a3111f2fead74fae45c6218ca3150fc33cab2aa59cfe41526b96aae79ce4ec",
        //         "amount": "12.000000000000000000",
        //         "from-addr-tag": "",
        //         "address-id": "27321591",
        //         "address": "TRf5JacJQRsF4Nm2zu11W6maDGeiEWQu9e",
        //         "address-tag": "",
        //         "fee": "1.000000000000000000",
        //         "state": "confirmed",
        //         "created-at": "1621852316553",
        //         "updated-at": "1621852467041"
        //     }
        //
        // withdraw
        //
        //     {
        //         "status": "ok",
        //         "data": "99562054"
        //     }
        //
        const timestamp = this.safeInteger (transaction, 'created-at');
        const code = this.safeCurrencyCode (this.safeString (transaction, 'currency'));
        let type = this.safeString (transaction, 'type');
        if (type === 'withdraw') {
            type = 'withdrawal';
        }
        let feeCost = this.safeString (transaction, 'fee');
        if (feeCost !== undefined) {
            feeCost = Precise.stringAbs (feeCost);
        }
        const networkId = this.safeString (transaction, 'chain');
        let txHash = this.safeString (transaction, 'tx-hash');
        if (networkId === 'ETH' && txHash.indexOf ('0x') < 0) {
            txHash = '0x' + txHash;
        }
        const subType = this.safeString (transaction, 'sub-type');
        const internal = subType === 'FAST';
        return {
            'info': transaction,
            'id': this.safeString2 (transaction, 'id', 'data'),
            'txid': txHash,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': this.networkIdToCode (networkId),
            'address': this.safeString (transaction, 'address'),
            'addressTo': undefined,
            'addressFrom': undefined,
            'tag': this.safeString (transaction, 'address-tag'),
            'tagTo': undefined,
            'tagFrom': undefined,
            'type': type,
            'amount': this.safeNumber (transaction, 'amount'),
            'currency': code,
            'status': this.parseTransactionStatus (this.safeString (transaction, 'state')),
            'updated': this.safeInteger (transaction, 'updated-at'),
            'comment': undefined,
            'internal': internal,
            'fee': {
                'currency': code,
                'cost': this.parseNumber (feeCost),
                'rate': undefined,
            },
        } as Transaction;
    }

    parseTransactionStatus (status: Str) {
        const statuses: Dict = {
            // deposit statuses
            'unknown': 'failed',
            'confirming': 'pending',
            'confirmed': 'ok',
            'safe': 'ok',
            'orphan': 'failed',
            // withdrawal statuses
            'submitted': 'pending',
            'canceled': 'canceled',
            'reexamine': 'pending',
            'reject': 'failed',
            'pass': 'pending',
            'wallet-reject': 'failed',
            // 'confirmed': 'ok', // present in deposit statuses
            'confirm-error': 'failed',
            'repealed': 'failed',
            'wallet-transfer': 'pending',
            'pre-transfer': 'pending',
        };
        return this.safeString (statuses, status, status);
    }

    /**
     * @method
     * @name htx#withdraw
     * @see https://www.htx.com/en-us/opend/newApiPages/?id=7ec4cc41-7773-11ed-9966-0242ac110003
     * @description make a withdrawal
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}): Promise<Transaction> {
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        await this.loadMarkets ();
        this.checkAddress (address);
        const currency = this.currency (code);
        const request: Dict = {
            'address': address, // only supports existing addresses in your withdraw address list
            'currency': currency['id'].toLowerCase (),
        };
        if (tag !== undefined) {
            request['addr-tag'] = tag; // only for XRP?
        }
        let networkCode = undefined;
        [ networkCode, params ] = this.handleNetworkCodeAndParams (params);
        if (networkCode !== undefined) {
            request['chain'] = this.networkCodeToId (networkCode, code);
        }
        amount = parseFloat (this.currencyToPrecision (code, amount, networkCode));
        const withdrawOptions = this.safeValue (this.options, 'withdraw', {});
        if (this.safeBool (withdrawOptions, 'includeFee', false)) {
            let fee = this.safeNumber (params, 'fee');
            if (fee === undefined) {
                const currencies = await this.fetchCurrencies ();
                this.currencies = this.mapToSafeMap (this.deepExtend (this.currencies, currencies));
                const targetNetwork = this.safeValue (currency['networks'], networkCode, {});
                fee = this.safeNumber (targetNetwork, 'fee');
                if (fee === undefined) {
                    throw new ArgumentsRequired (this.id + ' withdraw() function can not find withdraw fee for chosen network. You need to re-load markets with "exchange.loadMarkets(true)", or provide the "fee" parameter');
                }
            }
            // fee needs to be deducted from whole amount
            const feeString = this.currencyToPrecision (code, fee, networkCode);
            params = this.omit (params, 'fee');
            const amountString = this.numberToString (amount);
            const amountSubtractedString = Precise.stringSub (amountString, feeString);
            const amountSubtracted = parseFloat (amountSubtractedString);
            request['fee'] = parseFloat (feeString);
            amount = parseFloat (this.currencyToPrecision (code, amountSubtracted, networkCode));
        }
        request['amount'] = amount;
        const response = await this.spotPrivatePostV1DwWithdrawApiCreate (this.extend (request, params));
        //
        //     {
        //         "status": "ok",
        //         "data": "99562054"
        //     }
        //
        return this.parseTransaction (response, currency);
    }

    parseTransfer (transfer: Dict, currency: Currency = undefined): TransferEntry {
        //
        // transfer
        //
        //     {
        //         "data": 12345,
        //         "status": "ok"
        //     }
        //
        const id = this.safeString (transfer, 'data');
        const code = this.safeCurrencyCode (undefined, currency);
        return {
            'info': transfer,
            'id': id,
            'timestamp': undefined,
            'datetime': undefined,
            'currency': code,
            'amount': undefined,
            'fromAccount': undefined,
            'toAccount': undefined,
            'status': undefined,
        };
    }

    /**
     * @method
     * @name htx#transfer
     * @description transfer currency internally between wallets on the same account
     * @see https://huobiapi.github.io/docs/dm/v1/en/#transfer-margin-between-spot-account-and-future-account
     * @see https://huobiapi.github.io/docs/spot/v1/en/#transfer-fund-between-spot-account-and-future-contract-account
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-transfer-margin-between-spot-account-and-usdt-margined-contracts-account
     * @see https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-cross-margin-account-cross
     * @see https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-spot-trading-account-to-isolated-margin-account-isolated
     * @see https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-cross-margin-account-to-spot-trading-account-cross
     * @see https://huobiapi.github.io/docs/spot/v1/en/#transfer-asset-from-isolated-margin-account-to-spot-trading-account-isolated
     * @param {string} code unified currency code
     * @param {float} amount amount to transfer
     * @param {string} fromAccount account to transfer from 'spot', 'future', 'swap'
     * @param {string} toAccount account to transfer to 'spot', 'future', 'swap'
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.symbol] used for isolated margin transfer
     * @param {string} [params.subType] 'linear' or 'inverse', only used when transfering to/from swap accounts
     * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
     */
    async transfer (code: string, amount: number, fromAccount: string, toAccount:string, params = {}): Promise<TransferEntry> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'currency': currency['id'],
            'amount': parseFloat (this.currencyToPrecision (code, amount)),
        };
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('transfer', undefined, params);
        let fromAccountId = this.convertTypeToAccount (fromAccount);
        let toAccountId = this.convertTypeToAccount (toAccount);
        const toCross = toAccountId === 'cross';
        const fromCross = fromAccountId === 'cross';
        const toIsolated = this.inArray (toAccountId, this.ids);
        const fromIsolated = this.inArray (fromAccountId, this.ids);
        const fromSpot = fromAccountId === 'pro';
        const toSpot = toAccountId === 'pro';
        if (fromSpot && toSpot) {
            throw new BadRequest (this.id + ' transfer () cannot make a transfer between ' + fromAccount + ' and ' + toAccount);
        }
        const fromOrToFuturesAccount = (fromAccountId === 'futures') || (toAccountId === 'futures');
        let response = undefined;
        if (fromOrToFuturesAccount) {
            let type = fromAccountId + '-to-' + toAccountId;
            type = this.safeString (params, 'type', type);
            request['type'] = type;
            response = await this.spotPrivatePostV1FuturesTransfer (this.extend (request, params));
        } else if (fromSpot && toCross) {
            response = await this.privatePostCrossMarginTransferIn (this.extend (request, params));
        } else if (fromCross && toSpot) {
            response = await this.privatePostCrossMarginTransferOut (this.extend (request, params));
        } else if (fromSpot && toIsolated) {
            request['symbol'] = toAccountId;
            response = await this.privatePostDwTransferInMargin (this.extend (request, params));
        } else if (fromIsolated && toSpot) {
            request['symbol'] = fromAccountId;
            response = await this.privatePostDwTransferOutMargin (this.extend (request, params));
        } else {
            if (subType === 'linear') {
                if ((fromAccountId === 'swap') || (fromAccount === 'linear-swap')) {
                    fromAccountId = 'linear-swap';
                } else {
                    toAccountId = 'linear-swap';
                }
                // check if cross-margin or isolated
                let symbol = this.safeString (params, 'symbol');
                params = this.omit (params, 'symbol');
                if (symbol !== undefined) {
                    symbol = this.marketId (symbol);
                    request['margin-account'] = symbol;
                } else {
                    request['margin-account'] = 'USDT'; // cross-margin
                }
            }
            request['from'] = fromSpot ? 'spot' : fromAccountId;
            request['to'] = toSpot ? 'spot' : toAccountId;
            response = await this.v2PrivatePostAccountTransfer (this.extend (request, params));
        }
        //
        //    {
        //        "code": "200",
        //        "data": "660150061",
        //        "message": "Succeed",
        //        "success": true,
        //        "print-log": true
        //    }
        //
        return this.parseTransfer (response, currency);
    }

    /**
     * @method
     * @name htx#fetchIsolatedBorrowRates
     * @description fetch the borrow interest rates of all currencies
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-loan-interest-rate-and-quota-isolated
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a list of [isolated borrow rate structures]{@link https://docs.ccxt.com/#/?id=isolated-borrow-rate-structure}
     */
    async fetchIsolatedBorrowRates (params = {}): Promise<IsolatedBorrowRates> {
        await this.loadMarkets ();
        const response = await this.spotPrivateGetV1MarginLoanInfo (params);
        //
        // {
        //     "status": "ok",
        //     "data": [
        //         {
        //             "symbol": "1inchusdt",
        //             "currencies": [
        //                 {
        //                     "currency": "1inch",
        //                     "interest-rate": "0.00098",
        //                     "min-loan-amt": "90.000000000000000000",
        //                     "max-loan-amt": "1000.000000000000000000",
        //                     "loanable-amt": "0.0",
        //                     "actual-rate": "0.00098"
        //                 },
        //                 {
        //                     "currency": "usdt",
        //                     "interest-rate": "0.00098",
        //                     "min-loan-amt": "100.000000000000000000",
        //                     "max-loan-amt": "1000.000000000000000000",
        //                     "loanable-amt": "0.0",
        //                     "actual-rate": "0.00098"
        //                 }
        //             ]
        //         },
        //         ...
        //     ]
        // }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseIsolatedBorrowRates (data);
    }

    parseIsolatedBorrowRate (info: Dict, market: Market = undefined): IsolatedBorrowRate {
        //
        //     {
        //         "symbol": "1inchusdt",
        //         "currencies": [
        //             {
        //                 "currency": "1inch",
        //                 "interest-rate": "0.00098",
        //                 "min-loan-amt": "90.000000000000000000",
        //                 "max-loan-amt": "1000.000000000000000000",
        //                 "loanable-amt": "0.0",
        //                 "actual-rate": "0.00098"
        //             },
        //             {
        //                 "currency": "usdt",
        //                 "interest-rate": "0.00098",
        //                 "min-loan-amt": "100.000000000000000000",
        //                 "max-loan-amt": "1000.000000000000000000",
        //                 "loanable-amt": "0.0",
        //                 "actual-rate": "0.00098"
        //             }
        //         ]
        //     },
        //
        const marketId = this.safeString (info, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        const currencies = this.safeValue (info, 'currencies', []);
        const baseData = this.safeValue (currencies, 0);
        const quoteData = this.safeValue (currencies, 1);
        const baseId = this.safeString (baseData, 'currency');
        const quoteId = this.safeString (quoteData, 'currency');
        return {
            'symbol': symbol,
            'base': this.safeCurrencyCode (baseId),
            'baseRate': this.safeNumber (baseData, 'actual-rate'),
            'quote': this.safeCurrencyCode (quoteId),
            'quoteRate': this.safeNumber (quoteData, 'actual-rate'),
            'period': 86400000,
            'timestamp': undefined,
            'datetime': undefined,
            'info': info,
        };
    }

    /**
     * @method
     * @name htx#fetchFundingRateHistory
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-historical-funding-rate
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-historical-funding-rate
     * @description fetches historical funding rate prices
     * @param {string} symbol unified symbol of the market to fetch the funding rate history for
     * @param {int} [since] not used by huobi, but filtered internally by ccxt
     * @param {int} [limit] not used by huobi, but filtered internally by ccxt
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
     */
    async fetchFundingRateHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchFundingRateHistory() requires a symbol argument');
        }
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallCursor ('fetchFundingRateHistory', symbol, since, limit, params, 'current_page', 'page_index', 1, 50) as FundingRateHistory[];
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'contract_code': market['id'],
        };
        if (limit !== undefined) {
            request['page_size'] = limit;
        } else {
            request['page_size'] = 50; // max
        }
        let response = undefined;
        if (market['inverse']) {
            response = await this.contractPublicGetSwapApiV1SwapHistoricalFundingRate (this.extend (request, params));
        } else if (market['linear']) {
            response = await this.contractPublicGetLinearSwapApiV1SwapHistoricalFundingRate (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchFundingRateHistory() supports inverse and linear swaps only');
        }
        //
        // {
        //     "status": "ok",
        //     "data": {
        //         "total_page": 62,
        //         "current_page": 1,
        //         "total_size": 1237,
        //         "data": [
        //             {
        //                 "avg_premium_index": "-0.000208064395065541",
        //                 "funding_rate": "0.000100000000000000",
        //                 "realized_rate": "0.000100000000000000",
        //                 "funding_time": "1638921600000",
        //                 "contract_code": "BTC-USDT",
        //                 "symbol": "BTC",
        //                 "fee_asset": "USDT"
        //             },
        //         ]
        //     },
        //     "ts": 1638939294277
        // }
        //
        const data = this.safeValue (response, 'data');
        const cursor = this.safeValue (data, 'current_page');
        const result = this.safeValue (data, 'data', []);
        const rates = [];
        for (let i = 0; i < result.length; i++) {
            const entry = result[i];
            entry['current_page'] = cursor;
            const marketId = this.safeString (entry, 'contract_code');
            const symbolInner = this.safeSymbol (marketId);
            const timestamp = this.safeInteger (entry, 'funding_time');
            rates.push ({
                'info': entry,
                'symbol': symbolInner,
                'fundingRate': this.safeNumber (entry, 'funding_rate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, market['symbol'], since, limit) as FundingRateHistory[];
    }

    parseFundingRate (contract, market: Market = undefined): FundingRate {
        //
        // {
        //      "status": "ok",
        //      "data": {
        //         "estimated_rate": "0.000100000000000000",
        //         "funding_rate": "0.000100000000000000",
        //         "contract_code": "BCH-USD",
        //         "symbol": "BCH",
        //         "fee_asset": "BCH",
        //         "funding_time": "1639094400000",
        //         "next_funding_time": "1639123200000"
        //     },
        //     "ts": 1639085854775
        // }
        //
        const nextFundingRate = this.safeNumber (contract, 'estimated_rate');
        const fundingTimestamp = this.safeInteger (contract, 'funding_time');
        const nextFundingTimestamp = this.safeInteger (contract, 'next_funding_time');
        const fundingTimeString = this.safeString (contract, 'funding_time');
        const nextFundingTimeString = this.safeString (contract, 'next_funding_time');
        const millisecondsInterval = Precise.stringSub (nextFundingTimeString, fundingTimeString);
        const marketId = this.safeString (contract, 'contract_code');
        const symbol = this.safeSymbol (marketId, market);
        return {
            'info': contract,
            'symbol': symbol,
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': undefined,
            'datetime': undefined,
            'fundingRate': this.safeNumber (contract, 'funding_rate'),
            'fundingTimestamp': fundingTimestamp,
            'fundingDatetime': this.iso8601 (fundingTimestamp),
            'nextFundingRate': nextFundingRate,
            'nextFundingTimestamp': nextFundingTimestamp,
            'nextFundingDatetime': this.iso8601 (nextFundingTimestamp),
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': this.parseFundingInterval (millisecondsInterval),
        } as FundingRate;
    }

    parseFundingInterval (interval) {
        const intervals: Dict = {
            '3600000': '1h',
            '14400000': '4h',
            '28800000': '8h',
            '57600000': '16h',
            '86400000': '24h',
        };
        return this.safeString (intervals, interval, interval);
    }

    /**
     * @method
     * @name htx#fetchFundingRate
     * @description fetch the current funding rate
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-funding-rate
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-funding-rate
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchFundingRate (symbol: string, params = {}): Promise<FundingRate> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'contract_code': market['id'],
        };
        let response = undefined;
        if (market['inverse']) {
            response = await this.contractPublicGetSwapApiV1SwapFundingRate (this.extend (request, params));
        } else if (market['linear']) {
            response = await this.contractPublicGetLinearSwapApiV1SwapFundingRate (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchFundingRate() supports inverse and linear swaps only');
        }
        //
        // {
        //     "status": "ok",
        //     "data": {
        //         "estimated_rate": "0.000100000000000000",
        //         "funding_rate": "0.000100000000000000",
        //         "contract_code": "BTC-USDT",
        //         "symbol": "BTC",
        //         "fee_asset": "USDT",
        //         "funding_time": "1603699200000",
        //         "next_funding_time": "1603728000000"
        //     },
        //     "ts": 1603696494714
        // }
        //
        const result = this.safeValue (response, 'data', {});
        return this.parseFundingRate (result, market);
    }

    /**
     * @method
     * @name htx#fetchFundingRates
     * @description fetch the funding rate for multiple markets
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-a-batch-of-funding-rate
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-a-batch-of-funding-rate
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rates-structure}, indexed by market symbols
     */
    async fetchFundingRates (symbols: Strings = undefined, params = {}): Promise<FundingRates> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const defaultSubType = this.safeString (this.options, 'defaultSubType', 'linear');
        let subType = undefined;
        [ subType, params ] = this.handleOptionAndParams (params, 'fetchFundingRates', 'subType', defaultSubType);
        if (symbols !== undefined) {
            const firstSymbol = this.safeString (symbols, 0);
            const market = this.market (firstSymbol);
            const isLinear = market['linear'];
            subType = isLinear ? 'linear' : 'inverse';
        }
        const request: Dict = {
            // 'contract_code': market['id'],
        };
        let response = undefined;
        if (subType === 'linear') {
            response = await this.contractPublicGetLinearSwapApiV1SwapBatchFundingRate (this.extend (request, params));
        } else if (subType === 'inverse') {
            response = await this.contractPublicGetSwapApiV1SwapBatchFundingRate (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchFundingRates() not support this market type');
        }
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "estimated_rate": "0.000100000000000000",
        //                 "funding_rate": "0.000100000000000000",
        //                 "contract_code": "MANA-USDT",
        //                 "symbol": "MANA",
        //                 "fee_asset": "USDT",
        //                 "funding_time": "1643356800000",
        //                 "next_funding_time": "1643385600000",
        //                 "trade_partition":"USDT"
        //             },
        //         ],
        //         "ts": 1643346173103
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseFundingRates (data, symbols);
    }

    /**
     * @method
     * @name htx#fetchBorrowInterest
     * @description fetch the interest owed by the user for borrowing currency for margin trading
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-cross
     * @see https://huobiapi.github.io/docs/spot/v1/en/#search-past-margin-orders-isolated
     * @param {string} code unified currency code
     * @param {string} symbol unified market symbol when fetch interest in isolated markets
     * @param {int} [since] the earliest time in ms to fetch borrrow interest for
     * @param {int} [limit] the maximum number of structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [borrow interest structures]{@link https://docs.ccxt.com/#/?id=borrow-interest-structure}
     */
    async fetchBorrowInterest (code: Str = undefined, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<BorrowInterest[]> {
        await this.loadMarkets ();
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchBorrowInterest', params);
        marginMode = (marginMode === undefined) ? 'cross' : marginMode;
        const request: Dict = {};
        if (since !== undefined) {
            request['start-date'] = this.yyyymmdd (since);
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        let market = undefined;
        let response = undefined;
        if (marginMode === 'isolated') {
            if (symbol !== undefined) {
                market = this.market (symbol);
                request['symbol'] = market['id'];
            }
            response = await this.privateGetMarginLoanOrders (this.extend (request, params));
        } else {  // Cross
            if (code !== undefined) {
                const currency = this.currency (code);
                request['currency'] = currency['id'];
            }
            response = await this.privateGetCrossMarginLoanOrders (this.extend (request, params));
        }
        //
        //    {
        //        "status":"ok",
        //        "data":[
        //            {
        //                "loan-balance":"0.100000000000000000",
        //                "interest-balance":"0.000200000000000000",
        //                "loan-amount":"0.100000000000000000",
        //                "accrued-at":1511169724531,
        //                "interest-amount":"0.000200000000000000",
        //                "filled-points":"0.2",
        //                "filled-ht":"0.2",
        //                "currency":"btc",
        //                "id":394,
        //                "state":"accrual",
        //                "account-id":17747,
        //                "user-id":119913,
        //                "created-at":1511169724531
        //            }
        //        ]
        //    }
        //
        const data = this.safeValue (response, 'data');
        const interest = this.parseBorrowInterests (data, market);
        return this.filterByCurrencySinceLimit (interest, code, since, limit);
    }

    parseBorrowInterest (info: Dict, market: Market = undefined): BorrowInterest {
        // isolated
        //    {
        //        "interest-rate":"0.000040830000000000",
        //        "user-id":35930539,
        //        "account-id":48916071,
        //        "updated-at":1649320794195,
        //        "deduct-rate":"1",
        //        "day-interest-rate":"0.000980000000000000",
        //        "hour-interest-rate":"0.000040830000000000",
        //        "loan-balance":"100.790000000000000000",
        //        "interest-balance":"0.004115260000000000",
        //        "loan-amount":"100.790000000000000000",
        //        "paid-coin":"0.000000000000000000",
        //        "accrued-at":1649320794148,
        //        "created-at":1649320794148,
        //        "interest-amount":"0.004115260000000000",
        //        "deduct-amount":"0",
        //        "deduct-currency":"",
        //        "paid-point":"0.000000000000000000",
        //        "currency":"usdt",
        //        "symbol":"ltcusdt",
        //        "id":20242721,
        //    }
        //
        // cross
        //   {
        //       "id":3416576,
        //       "user-id":35930539,
        //       "account-id":48956839,
        //       "currency":"usdt",
        //       "loan-amount":"102",
        //       "loan-balance":"102",
        //       "interest-amount":"0.00416466",
        //       "interest-balance":"0.00416466",
        //       "created-at":1649322735333,
        //       "accrued-at":1649322735382,
        //       "state":"accrual",
        //       "filled-points":"0",
        //       "filled-ht":"0"
        //   }
        //
        const marketId = this.safeString (info, 'symbol');
        const marginMode = (marketId === undefined) ? 'cross' : 'isolated';
        market = this.safeMarket (marketId);
        const symbol = this.safeString (market, 'symbol');
        const timestamp = this.safeInteger (info, 'accrued-at');
        return {
            'info': info,
            'symbol': symbol,
            'currency': this.safeCurrencyCode (this.safeString (info, 'currency')),
            'interest': this.safeNumber (info, 'interest-amount'),
            'interestRate': this.safeNumber (info, 'interest-rate'),
            'amountBorrowed': this.safeNumber (info, 'loan-amount'),
            'marginMode': marginMode,
            'timestamp': timestamp,  // Interest accrued time
            'datetime': this.iso8601 (timestamp),
        } as BorrowInterest;
    }

    nonce () {
        return this.milliseconds () - this.options['timeDifference'];
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = '/';
        const query = this.omit (params, this.extractParams (path));
        if (typeof api === 'string') {
            // signing implementation for the old endpoints
            if ((api === 'public') || (api === 'private')) {
                url += this.version;
            } else if ((api === 'v2Public') || (api === 'v2Private')) {
                url += 'v2';
            }
            url += '/' + this.implodeParams (path, params);
            if (api === 'private' || api === 'v2Private') {
                this.checkRequiredCredentials ();
                const timestamp = this.ymdhms (this.nonce (), 'T');
                let request: Dict = {
                    'SignatureMethod': 'HmacSHA256',
                    'SignatureVersion': '2',
                    'AccessKeyId': this.apiKey,
                    'Timestamp': timestamp,
                };
                if (method !== 'POST') {
                    request = this.extend (request, query);
                }
                const sortedRequest = this.keysort (request);
                let auth = this.urlencode (sortedRequest, true); // true is a go only requirment
                // unfortunately, PHP demands double quotes for the escaped newline symbol
                const payload = [ method, this.hostname, url, auth ].join ("\n"); // eslint-disable-line quotes
                const signature = this.hmac (this.encode (payload), this.encode (this.secret), sha256, 'base64');
                auth += '&' + this.urlencode ({ 'Signature': signature });
                url += '?' + auth;
                if (method === 'POST') {
                    body = this.json (query);
                    headers = {
                        'Content-Type': 'application/json',
                    };
                } else {
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };
                }
            } else {
                if (Object.keys (query).length) {
                    url += '?' + this.urlencode (query);
                }
            }
            url = this.implodeParams (this.urls['api'][api], {
                'hostname': this.hostname,
            }) + url;
        } else {
            // signing implementation for the new endpoints
            // const [ type, access ] = api;
            const type = this.safeString (api, 0);
            const access = this.safeString (api, 1);
            const levelOneNestedPath = this.safeString (api, 2);
            const levelTwoNestedPath = this.safeString (api, 3);
            let hostname = undefined;
            let hostnames = this.safeValue (this.urls['hostnames'], type);
            if (typeof hostnames !== 'string') {
                hostnames = this.safeValue (hostnames, levelOneNestedPath);
                if ((typeof hostnames !== 'string') && (levelTwoNestedPath !== undefined)) {
                    hostnames = this.safeValue (hostnames, levelTwoNestedPath);
                }
            }
            hostname = hostnames;
            url += this.implodeParams (path, params);
            if (access === 'public') {
                if (Object.keys (query).length) {
                    url += '?' + this.urlencode (query);
                }
            } else if (access === 'private') {
                this.checkRequiredCredentials ();
                if (method === 'POST') {
                    const options = this.safeValue (this.options, 'broker', {});
                    const id = this.safeString (options, 'id', 'AA03022abc');
                    if (path.indexOf ('cancel') === -1 && path.endsWith ('order')) {
                        // swap order placement
                        const channelCode = this.safeString (params, 'channel_code');
                        if (channelCode === undefined) {
                            params['channel_code'] = id;
                        }
                    } else if (path.endsWith ('orders/place')) {
                        // spot order placement
                        const clientOrderId = this.safeString (params, 'client-order-id');
                        if (clientOrderId === undefined) {
                            params['client-order-id'] = id + this.uuid ();
                        }
                    }
                }
                const timestamp = this.ymdhms (this.nonce (), 'T');
                let request: Dict = {
                    'SignatureMethod': 'HmacSHA256',
                    'SignatureVersion': '2',
                    'AccessKeyId': this.apiKey,
                    'Timestamp': timestamp,
                };
                // sorting needs such flow exactly, before urlencoding (more at: https://github.com/ccxt/ccxt/issues/24930 )
                request = this.keysort (request) as any;
                if (method !== 'POST') {
                    const sortedQuery = this.keysort (query) as any;
                    request = this.extend (request, sortedQuery);
                }
                let auth = this.urlencode (request, true).replace ('%2c', '%2C'); // in c# it manually needs to be uppercased
                // unfortunately, PHP demands double quotes for the escaped newline symbol
                const payload = [ method, hostname, url, auth ].join ("\n"); // eslint-disable-line quotes
                const signature = this.hmac (this.encode (payload), this.encode (this.secret), sha256, 'base64');
                auth += '&' + this.urlencode ({ 'Signature': signature });
                url += '?' + auth;
                if (method === 'POST') {
                    body = this.json (query);
                    if (body.length === 2) {
                        body = '{}';
                    }
                    headers = {
                        'Content-Type': 'application/json',
                    };
                } else {
                    headers = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };
                }
            }
            url = this.implodeParams (this.urls['api'][type], {
                'hostname': hostname,
            }) + url;
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        if ('status' in response) {
            //
            //     {"status":"error","err-code":"order-limitorder-amount-min-error","err-msg":"limit order amount error, min: `0.001`","data":null}
            //     {"status":"ok","data":{"errors":[{"order_id":"1349442392365359104","err_code":1061,"err_msg":"The order does not exist."}],"successes":""},"ts":1741773744526}
            //
            const status = this.safeString (response, 'status');
            if (status === 'error') {
                const code = this.safeString2 (response, 'err-code', 'err_code');
                const feedback = this.id + ' ' + body;
                this.throwBroadlyMatchedException (this.exceptions['broad'], body, feedback);
                this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
                const message = this.safeString2 (response, 'err-msg', 'err_msg');
                this.throwExactlyMatchedException (this.exceptions['exact'], message, feedback);
                throw new ExchangeError (feedback);
            }
        }
        if ('code' in response) {
            // {code: '1003', message: 'invalid signature'}
            const feedback = this.id + ' ' + body;
            const code = this.safeString (response, 'code');
            this.throwExactlyMatchedException (this.exceptions['exact'], code, feedback);
        }
        const data = this.safeDict (response, 'data');
        const errorsList = this.safeList (data, 'errors');
        if (errorsList !== undefined) {
            const first = this.safeDict (errorsList, 0);
            const errcode = this.safeString (first, 'err_code');
            const errmessage = this.safeString (first, 'err_msg');
            const feedBack = this.id + ' ' + body;
            this.throwExactlyMatchedException (this.exceptions['exact'], errcode, feedBack);
            this.throwExactlyMatchedException (this.exceptions['exact'], errmessage, feedBack);
        }
        return undefined;
    }

    /**
     * @method
     * @name htx#fetchFundingHistory
     * @description fetch the history of funding payments paid and received on this account
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-account-financial-records-via-multiple-fields-new   // linear swaps
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-financial-records-via-multiple-fields-new                          // coin-m futures
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-financial-records-via-multiple-fields-new          // coin-m swaps
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch funding history for
     * @param {int} [limit] the maximum number of funding history structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding history structure]{@link https://docs.ccxt.com/#/?id=funding-history-structure}
     */
    async fetchFundingHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const [ marketType, query ] = this.handleMarketTypeAndParams ('fetchFundingHistory', market, params);
        const request: Dict = {
            'type': '30,31',
        };
        if (since !== undefined) {
            request['start_date'] = since;
        }
        let response = undefined;
        if (marketType === 'swap') {
            request['contract'] = market['id'];
            if (market['linear']) {
                //
                //    {
                //        "status": "ok",
                //        "data": {
                //           "financial_record": [
                //               {
                //                   "id": "1320088022",
                //                   "type": "30",
                //                   "amount": "0.004732510000000000",
                //                   "ts": "1641168019321",
                //                   "contract_code": "BTC-USDT",
                //                   "asset": "USDT",
                //                   "margin_account": "BTC-USDT",
                //                   "face_margin_account": ''
                //               },
                //           ],
                //           "remain_size": "0",
                //           "next_id": null
                //        },
                //        "ts": "1641189898425"
                //    }
                //
                let marginMode = undefined;
                [ marginMode, params ] = this.handleMarginModeAndParams ('fetchFundingHistory', params);
                marginMode = (marginMode === undefined) ? 'cross' : marginMode;
                if (marginMode === 'isolated') {
                    request['mar_acct'] = market['id'];
                } else {
                    request['mar_acct'] = market['quoteId'];
                }
                response = await this.contractPrivatePostLinearSwapApiV3SwapFinancialRecordExact (this.extend (request, query));
            } else {
                //
                //     {
                //         "code": 200,
                //         "msg": "",
                //         "data": [
                //             {
                //                 "query_id": 138798248,
                //                 "id": 117840,
                //                 "type": 5,
                //                 "amount": -0.024464850000000000,
                //                 "ts": 1638758435635,
                //                 "contract_code": "BTC-USDT-211210",
                //                 "asset": "USDT",
                //                 "margin_account": "USDT",
                //                 "face_margin_account": ""
                //             }
                //         ],
                //         "ts": 1604312615051
                //     }
                //
                response = await this.contractPrivatePostSwapApiV3SwapFinancialRecordExact (this.extend (request, query));
            }
        } else {
            request['symbol'] = market['id'];
            response = await this.contractPrivatePostApiV3ContractFinancialRecordExact (this.extend (request, query));
        }
        const data = this.safeList (response, 'data', []);
        return this.parseIncomes (data, market, since, limit);
    }

    /**
     * @method
     * @name htx#setLeverage
     * @description set the level of leverage for a market
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-switch-leverage
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-switch-leverage
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#switch-leverage
     * @see https://huobiapi.github.io/docs/dm/v1/en/#switch-leverage  // Coin-m futures
     * @param {float} leverage the rate of leverage
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const [ marketType, query ] = this.handleMarketTypeAndParams ('setLeverage', market, params);
        const request: Dict = {
            'lever_rate': leverage,
        };
        if (marketType === 'future' && market['inverse']) {
            request['symbol'] = market['settleId'];
        } else {
            request['contract_code'] = market['id'];
        }
        let response = undefined;
        if (market['linear']) {
            let marginMode = undefined;
            [ marginMode, params ] = this.handleMarginModeAndParams ('setLeverage', params);
            marginMode = (marginMode === undefined) ? 'cross' : marginMode;
            if (marginMode === 'isolated') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapSwitchLeverRate (this.extend (request, query));
            } else if (marginMode === 'cross') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapCrossSwitchLeverRate (this.extend (request, query));
            } else {
                throw new NotSupported (this.id + ' setLeverage() not support this market type');
            }
            //
            //     {
            //       "status": "ok",
            //       "data": {
            //         "contract_code": "BTC-USDT",
            //         "lever_rate": "100",
            //         "margin_mode": "isolated"
            //       },
            //       "ts": "1641184710649"
            //     }
            //
        } else {
            if (marketType === 'future') {
                response = await this.contractPrivatePostApiV1ContractSwitchLeverRate (this.extend (request, query));
            } else if (marketType === 'swap') {
                response = await this.contractPrivatePostSwapApiV1SwapSwitchLeverRate (this.extend (request, query));
            } else {
                throw new NotSupported (this.id + ' setLeverage() not support this market type');
            }
            //
            // future
            //     {
            //       "status": "ok",
            //       "data": { symbol: "BTC", lever_rate: 5 },
            //       "ts": 1641184578678
            //     }
            //
            // swap
            //
            //     {
            //       "status": "ok",
            //       "data": { contract_code: "BTC-USD", lever_rate: "5" },
            //       "ts": "1641184652979"
            //     }
            //
        }
        return response;
    }

    parseIncome (income, market: Market = undefined) {
        //
        //     {
        //       "id": "1667161118",
        //       "symbol": "BTC",
        //       "type": "31",
        //       "amount": "-2.11306593188E-7",
        //       "ts": "1641139308983",
        //       "contract_code": "BTC-USD"
        //     }
        //
        const marketId = this.safeString (income, 'contract_code');
        const symbol = this.safeSymbol (marketId, market);
        const amount = this.safeNumber (income, 'amount');
        const timestamp = this.safeInteger (income, 'ts');
        const id = this.safeString (income, 'id');
        const currencyId = this.safeString2 (income, 'symbol', 'asset');
        const code = this.safeCurrencyCode (currencyId);
        return {
            'info': income,
            'symbol': symbol,
            'code': code,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': id,
            'amount': amount,
        };
    }

    parsePosition (position: Dict, market: Market = undefined) {
        //
        //    {
        //        "symbol": "BTC",
        //        "contract_code": "BTC-USDT",
        //        "volume": "1.000000000000000000",
        //        "available": "1.000000000000000000",
        //        "frozen": "0E-18",
        //        "cost_open": "47162.000000000000000000",
        //        "cost_hold": "47151.300000000000000000",
        //        "profit_unreal": "0.007300000000000000",
        //        "profit_rate": "-0.000144183876850008",
        //        "lever_rate": "2",
        //        "position_margin": "23.579300000000000000",
        //        "direction": "buy",
        //        "profit": "-0.003400000000000000",
        //        "last_price": "47158.6",
        //        "margin_asset": "USDT",
        //        "margin_mode": "isolated",
        //        "margin_account": "BTC-USDT",
        //        "margin_balance": "24.973020070000000000",
        //        "margin_position": "23.579300000000000000",
        //        "margin_frozen": "0",
        //        "margin_available": "1.393720070000000000",
        //        "profit_real": "0E-18",
        //        "risk_rate": "1.044107779705080303",
        //        "withdraw_available": "1.386420070000000000000000000000000000",
        //        "liquidation_price": "22353.229148614609571788",
        //        "adjust_factor": "0.015000000000000000",
        //        "margin_static": "24.965720070000000000"
        //    }
        //
        market = this.safeMarket (this.safeString (position, 'contract_code'));
        const symbol = market['symbol'];
        const contracts = this.safeString (position, 'volume');
        const contractSize = this.safeValue (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        const entryPrice = this.safeNumber (position, 'cost_open');
        const initialMargin = this.safeString (position, 'position_margin');
        const rawSide = this.safeString (position, 'direction');
        const side = (rawSide === 'buy') ? 'long' : 'short';
        const unrealizedProfit = this.safeNumber (position, 'profit_unreal');
        let marginMode = this.safeString (position, 'margin_mode');
        const leverage = this.safeString (position, 'lever_rate');
        const percentage = Precise.stringMul (this.safeString (position, 'profit_rate'), '100');
        const lastPrice = this.safeString (position, 'last_price');
        const faceValue = Precise.stringMul (contracts, contractSizeString);
        let notional = undefined;
        if (market['linear']) {
            notional = Precise.stringMul (faceValue, lastPrice);
        } else {
            notional = Precise.stringDiv (faceValue, lastPrice);
            marginMode = 'cross';
        }
        const intialMarginPercentage = Precise.stringDiv (initialMargin, notional);
        const collateral = this.safeString (position, 'margin_balance');
        const liquidationPrice = this.safeNumber (position, 'liquidation_price');
        const adjustmentFactor = this.safeString (position, 'adjust_factor');
        const maintenanceMarginPercentage = Precise.stringDiv (adjustmentFactor, leverage);
        const maintenanceMargin = Precise.stringMul (maintenanceMarginPercentage, notional);
        const marginRatio = Precise.stringDiv (maintenanceMargin, collateral);
        return this.safePosition ({
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'contracts': this.parseNumber (contracts),
            'contractSize': contractSize,
            'entryPrice': entryPrice,
            'collateral': this.parseNumber (collateral),
            'side': side,
            'unrealizedPnl': unrealizedProfit,
            'leverage': this.parseNumber (leverage),
            'percentage': this.parseNumber (percentage),
            'marginMode': marginMode,
            'notional': this.parseNumber (notional),
            'markPrice': undefined,
            'lastPrice': undefined,
            'liquidationPrice': liquidationPrice,
            'initialMargin': this.parseNumber (initialMargin),
            'initialMarginPercentage': this.parseNumber (intialMarginPercentage),
            'maintenanceMargin': this.parseNumber (maintenanceMargin),
            'maintenanceMarginPercentage': this.parseNumber (maintenanceMarginPercentage),
            'marginRatio': this.parseNumber (marginRatio),
            'timestamp': undefined,
            'datetime': undefined,
            'hedged': undefined,
            'lastUpdateTimestamp': undefined,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        });
    }

    /**
     * @method
     * @name htx#fetchPositions
     * @description fetch all open positions
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-query-user-39-s-position-information
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-query-user-s-position-information
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-user-s-position-information
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-user-s-position-information
     * @param {string[]} [symbols] list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] 'linear' or 'inverse'
     * @param {string} [params.type] *inverse only* 'future', or 'swap'
     * @param {string} [params.marginMode] *linear only* 'cross' or 'isolated'
     * @returns {object[]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPositions (symbols: Strings = undefined, params = {}): Promise<Position[]> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        let market = undefined;
        if (symbols !== undefined) {
            const symbolsLength = symbols.length;
            if (symbolsLength > 0) {
                const first = this.safeString (symbols, 0);
                market = this.market (first);
            }
        }
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchPositions', params, 'cross');
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchPositions', market, params, 'linear');
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchPositions', market, params);
        if (marketType === 'spot') {
            marketType = 'future';
        }
        let response = undefined;
        if (subType === 'linear') {
            if (marginMode === 'isolated') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapPositionInfo (params);
            } else if (marginMode === 'cross') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapCrossPositionInfo (params);
            } else {
                throw new NotSupported (this.id + ' fetchPositions() not support this market type');
            }
            //
            //     {
            //       "status": "ok",
            //       "data": [
            //         {
            //           "symbol": "BTC",
            //           "contract_code": "BTC-USDT",
            //           "volume": "1.000000000000000000",
            //           "available": "1.000000000000000000",
            //           "frozen": "0E-18",
            //           "cost_open": "47162.000000000000000000",
            //           "cost_hold": "47162.000000000000000000",
            //           "profit_unreal": "0.047300000000000000",
            //           "profit_rate": "0.002005852169119206",
            //           "lever_rate": "2",
            //           "position_margin": "23.604650000000000000",
            //           "direction": "buy",
            //           "profit": "0.047300000000000000",
            //           "last_price": "47209.3",
            //           "margin_asset": "USDT",
            //           "margin_mode": "isolated",
            //           "margin_account": "BTC-USDT"
            //         }
            //       ],
            //       "ts": "1641108676768"
            //     }
            //
        } else {
            if (marketType === 'future') {
                response = await this.contractPrivatePostApiV1ContractPositionInfo (params);
            } else if (marketType === 'swap') {
                response = await this.contractPrivatePostSwapApiV1SwapPositionInfo (params);
            } else {
                throw new NotSupported (this.id + ' fetchPositions() not support this market type');
            }
            //
            // future
            //     {
            //       "status": "ok",
            //       "data": [
            //         {
            //           "symbol": "BTC",
            //           "contract_code": "BTC220624",
            //           "contract_type": "next_quarter",
            //           "volume": "1.000000000000000000",
            //           "available": "1.000000000000000000",
            //           "frozen": "0E-18",
            //           "cost_open": "49018.880000000009853343",
            //           "cost_hold": "49018.880000000009853343",
            //           "profit_unreal": "-8.62360608500000000000000000000000000000000000000E-7",
            //           "profit_rate": "-0.000845439023678622",
            //           "lever_rate": "2",
            //           "position_margin": "0.001019583964880634",
            //           "direction": "sell",
            //           "profit": "-8.62360608500000000000000000000000000000000000000E-7",
            //           "last_price": "49039.61"
            //         }
            //       ],
            //       "ts": "1641109895199"
            //     }
            //
            // swap
            //     {
            //       "status": "ok",
            //       "data": [
            //         {
            //           "symbol": "BTC",
            //           "contract_code": "BTC-USD",
            //           "volume": "1.000000000000000000",
            //           "available": "1.000000000000000000",
            //           "frozen": "0E-18",
            //           "cost_open": "47150.000000000012353300",
            //           "cost_hold": "47150.000000000012353300",
            //           "profit_unreal": "0E-54",
            //           "profit_rate": "-7.86E-16",
            //           "lever_rate": "3",
            //           "position_margin": "0.000706963591375044",
            //           "direction": "buy",
            //           "profit": "0E-54",
            //           "last_price": "47150"
            //         }
            //       ],
            //       "ts": "1641109636572"
            //     }
            //
        }
        const data = this.safeValue (response, 'data', []);
        const timestamp = this.safeInteger (response, 'ts');
        const result = [];
        for (let i = 0; i < data.length; i++) {
            const position = data[i];
            const parsed = this.parsePosition (position);
            result.push (this.extend (parsed, {
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            }));
        }
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    /**
     * @method
     * @name htx#fetchPosition
     * @description fetch data on a single open contract trade position
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-query-assets-and-positions
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-query-assets-and-positions
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-assets-and-positions
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-assets-and-positions
     * @param {string} symbol unified market symbol of the market the position is held in, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPosition (symbol: string, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchPosition', params);
        marginMode = (marginMode === undefined) ? 'cross' : marginMode;
        const [ marketType, query ] = this.handleMarketTypeAndParams ('fetchPosition', market, params);
        const request: Dict = {};
        if (market['future'] && market['inverse']) {
            request['symbol'] = market['settleId'];
        } else {
            if (marginMode === 'cross') {
                request['margin_account'] = 'USDT'; // only allowed value
            }
            request['contract_code'] = market['id'];
        }
        let response = undefined;
        if (market['linear']) {
            if (marginMode === 'isolated') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapAccountPositionInfo (this.extend (request, query));
            } else if (marginMode === 'cross') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapCrossAccountPositionInfo (this.extend (request, query));
            } else {
                throw new NotSupported (this.id + ' fetchPosition() not support this market type');
            }
            //
            // isolated
            //
            //     {
            //         "status": "ok",
            //         "data": [
            //             {
            //                 "positions": [],
            //                 "symbol": "BTC",
            //                 "margin_balance": 1.949728350000000000,
            //                 "margin_position": 0,
            //                 "margin_frozen": 0E-18,
            //                 "margin_available": 1.949728350000000000,
            //                 "profit_real": -0.050271650000000000,
            //                 "profit_unreal": 0,
            //                 "risk_rate": null,
            //                 "withdraw_available": 1.949728350000000000,
            //                 "liquidation_price": null,
            //                 "lever_rate": 20,
            //                 "adjust_factor": 0.150000000000000000,
            //                 "margin_static": 1.949728350000000000,
            //                 "contract_code": "BTC-USDT",
            //                 "margin_asset": "USDT",
            //                 "margin_mode": "isolated",
            //                 "margin_account": "BTC-USDT",
            //                 "trade_partition": "USDT",
            //                 "position_mode": "dual_side"
            //             },
            //             ... opposite side position can be present here too (if hedge)
            //         ],
            //         "ts": 1653605008286
            //     }
            //
            // cross
            //
            //     {
            //         "status": "ok",
            //         "data": {
            //             "positions": [
            //                 {
            //                     "symbol": "BTC",
            //                     "contract_code": "BTC-USDT",
            //                     "volume": "1.000000000000000000",
            //                     "available": "1.000000000000000000",
            //                     "frozen": "0E-18",
            //                     "cost_open": "29530.000000000000000000",
            //                     "cost_hold": "29530.000000000000000000",
            //                     "profit_unreal": "-0.010000000000000000",
            //                     "profit_rate": "-0.016931933626820200",
            //                     "lever_rate": "50",
            //                     "position_margin": "0.590400000000000000",
            //                     "direction": "buy",
            //                     "profit": "-0.010000000000000000",
            //                     "last_price": "29520",
            //                     "margin_asset": "USDT",
            //                     "margin_mode": "cross",
            //                     "margin_account": "USDT",
            //                     "contract_type": "swap",
            //                     "pair": "BTC-USDT",
            //                     "business_type": "swap",
            //                     "trade_partition": "USDT",
            //                     "position_mode": "dual_side"
            //                 },
            //                 ... opposite side position can be present here too (if hedge)
            //             ],
            //             "futures_contract_detail": [
            //                 {
            //                     "symbol": "BTC",
            //                     "contract_code": "BTC-USDT-220624",
            //                     "margin_position": "0",
            //                     "margin_frozen": "0E-18",
            //                     "margin_available": "1.497799766913531118",
            //                     "profit_unreal": "0",
            //                     "liquidation_price": null,
            //                     "lever_rate": "30",
            //                     "adjust_factor": "0.250000000000000000",
            //                     "contract_type": "quarter",
            //                     "pair": "BTC-USDT",
            //                     "business_type": "futures",
            //                     "trade_partition": "USDT"
            //                 },
            //                 ... other items listed with different expiration (contract_code)
            //             ],
            //             "margin_mode": "cross",
            //             "margin_account": "USDT",
            //             "margin_asset": "USDT",
            //             "margin_balance": "2.088199766913531118",
            //             "margin_static": "2.098199766913531118",
            //             "margin_position": "0.590400000000000000",
            //             "margin_frozen": "0E-18",
            //             "profit_real": "-0.016972710000000000",
            //             "profit_unreal": "-0.010000000000000000",
            //             "withdraw_available": "1.497799766913531118",
            //             "risk_rate": "9.105496355562965147",
            //             "contract_detail": [
            //                {
            //                     "symbol": "BTC",
            //                     "contract_code": "BTC-USDT",
            //                     "margin_position": "0.590400000000000000",
            //                     "margin_frozen": "0E-18",
            //                     "margin_available": "1.497799766913531118",
            //                     "profit_unreal": "-0.010000000000000000",
            //                     "liquidation_price": "27625.176468365024050352",
            //                     "lever_rate": "50",
            //                     "adjust_factor": "0.350000000000000000",
            //                     "contract_type": "swap",
            //                     "pair": "BTC-USDT",
            //                     "business_type": "swap",
            //                     "trade_partition": "USDT"
            //                 },
            //                 ... all symbols listed
            //             ],
            //             "position_mode": "dual_side"
            //         },
            //         "ts": "1653604697466"
            //     }
            //
        } else {
            if (marketType === 'future') {
                response = await this.contractPrivatePostApiV1ContractAccountPositionInfo (this.extend (request, query));
            } else if (marketType === 'swap') {
                response = await this.contractPrivatePostSwapApiV1SwapAccountPositionInfo (this.extend (request, query));
            } else {
                throw new NotSupported (this.id + ' setLeverage() not support this market type');
            }
            //
            // future, swap
            //
            //     {
            //       "status": "ok",
            //       "data": [
            //         {
            //             "symbol": "XRP",
            //             "contract_code": "XRP-USD", // only present in swap
            //             "margin_balance": 12.186361450698276582,
            //             "margin_position": 5.036261079774375503,
            //             "margin_frozen": 0E-18,
            //             "margin_available": 7.150100370923901079,
            //             "profit_real": -0.012672343876723438,
            //             "profit_unreal": 0.163382354575000020,
            //             "risk_rate": 2.344723929650649798,
            //             "withdraw_available": 6.986718016348901059,
            //             "liquidation_price": 0.271625200493799547,
            //             "lever_rate": 5,
            //             "adjust_factor": 0.075000000000000000,
            //             "margin_static": 12.022979096123276562,
            //             "positions": [
            //                 {
            //                     "symbol": "XRP",
            //                     "contract_code": "XRP-USD",
            //                     // "contract_type": "this_week", // only present in future
            //                     "volume": 1.0,
            //                     "available": 1.0,
            //                     "frozen": 0E-18,
            //                     "cost_open": 0.394560000000000000,
            //                     "cost_hold": 0.394560000000000000,
            //                     "profit_unreal": 0.163382354575000020,
            //                     "profit_rate": 0.032232070910556005,
            //                     "lever_rate": 5,
            //                     "position_margin": 5.036261079774375503,
            //                     "direction": "buy",
            //                     "profit": 0.163382354575000020,
            //                     "last_price": 0.39712
            //                 },
            //                 ... opposite side position can be present here too (if hedge)
            //             ]
            //         }
            //       ],
            //       "ts": 1653600470199
            //     }
            //
            // cross usdt swap
            //
            //     {
            //         "status":"ok",
            //         "data":{
            //             "positions":[],
            //             "futures_contract_detail":[]
            //             "margin_mode":"cross",
            //             "margin_account":"USDT",
            //             "margin_asset":"USDT",
            //             "margin_balance":"1.000000000000000000",
            //             "margin_static":"1.000000000000000000",
            //             "margin_position":"0",
            //             "margin_frozen":"1.000000000000000000",
            //             "profit_real":"0E-18",
            //             "profit_unreal":"0",
            //             "withdraw_available":"0",
            //             "risk_rate":"15.666666666666666666",
            //             "contract_detail":[]
            //         },
            //         "ts":"1645521118946"
            //     }
            //
        }
        const data = this.safeValue (response, 'data');
        let account = undefined;
        if (marginMode === 'cross') {
            account = data;
        } else {
            account = this.safeValue (data, 0);
        }
        const omitted = this.omit (account, [ 'positions' ]);
        const positions = this.safeValue (account, 'positions');
        let position = undefined;
        if (market['future'] && market['inverse']) {
            for (let i = 0; i < positions.length; i++) {
                const entry = positions[i];
                if (entry['contract_code'] === market['id']) {
                    position = entry;
                    break;
                }
            }
        } else {
            position = this.safeValue (positions, 0);
        }
        const timestamp = this.safeInteger (response, 'ts');
        const parsed = this.parsePosition (this.extend (position, omitted));
        parsed['timestamp'] = timestamp;
        parsed['datetime'] = this.iso8601 (timestamp);
        return parsed;
    }

    parseLedgerEntryType (type) {
        const types: Dict = {
            'trade': 'trade',
            'etf': 'trade',
            'transact-fee': 'fee',
            'fee-deduction': 'fee',
            'transfer': 'transfer',
            'credit': 'credit',
            'liquidation': 'trade',
            'interest': 'credit',
            'deposit': 'deposit',
            'withdraw': 'withdrawal',
            'withdraw-fee': 'fee',
            'exchange': 'exchange',
            'other-types': 'transfer',
            'rebate': 'rebate',
        };
        return this.safeString (types, type, type);
    }

    parseLedgerEntry (item: Dict, currency: Currency = undefined): LedgerEntry {
        //
        //     {
        //         "accountId": 10000001,
        //         "currency": "usdt",
        //         "transactAmt": 10.000000000000000000,
        //         "transactType": "transfer",
        //         "transferType": "margin-transfer-out",
        //         "transactId": 0,
        //         "transactTime": 1629882331066,
        //         "transferer": 28483123,
        //         "transferee": 13496526
        //     }
        //
        const currencyId = this.safeString (item, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        currency = this.safeCurrency (currencyId, currency);
        const id = this.safeString (item, 'transactId');
        const transferType = this.safeString (item, 'transferType');
        const timestamp = this.safeInteger (item, 'transactTime');
        const account = this.safeString (item, 'accountId');
        return this.safeLedgerEntry ({
            'info': item,
            'id': id,
            'direction': this.safeString (item, 'direction'),
            'account': account,
            'referenceId': id,
            'referenceAccount': account,
            'type': this.parseLedgerEntryType (transferType),
            'currency': code,
            'amount': this.safeNumber (item, 'transactAmt'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'before': undefined,
            'after': undefined,
            'status': undefined,
            'fee': undefined,
        }, currency) as LedgerEntry;
    }

    /**
     * @method
     * @name htx#fetchLedger
     * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-account-history
     * @param {string} [code] unified currency code, default is undefined
     * @param {int} [since] timestamp in ms of the earliest ledger entry, default is undefined
     * @param {int} [limit] max number of ledger entries to return, default is undefined
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger}
     */
    async fetchLedger (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<LedgerEntry[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchLedger', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchLedger', code, since, limit, params, 500) as LedgerEntry[];
        }
        const accountId = await this.fetchAccountIdByType ('spot', undefined, undefined, params);
        let request: Dict = {
            'accountId': accountId,
            // 'currency': code,
            // 'transactTypes': 'all', // default all
            // 'startTime': 1546272000000,
            // 'endTime': 1546272000000,
            // 'sort': asc, // asc, desc
            // 'limit': 100, // range 1-500
            // 'fromId': 323 // first record ID in this query for pagination
        };
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
            request['currency'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit; // max 500
        }
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        const response = await this.spotPrivateGetV2AccountLedger (this.extend (request, params));
        //
        //     {
        //         "code": 200,
        //         "message": "success",
        //         "data": [
        //             {
        //                 "accountId": 10000001,
        //                 "currency": "usdt",
        //                 "transactAmt": 10.000000000000000000,
        //                 "transactType": "transfer",
        //                 "transferType": "margin-transfer-out",
        //                 "transactId": 0,
        //                 "transactTime": 1629882331066,
        //                 "transferer": 28483123,
        //                 "transferee": 13496526
        //             },
        //             {
        //                 "accountId": 10000001,
        //                 "currency": "usdt",
        //                 "transactAmt": -10.000000000000000000,
        //                 "transactType": "transfer",
        //                 "transferType": "margin-transfer-in",
        //                 "transactId": 0,
        //                 "transactTime": 1629882096562,
        //                 "transferer": 13496526,
        //                 "transferee": 28483123
        //             }
        //         ],
        //         "nextId": 1624316679,
        //         "ok": true
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        return this.parseLedger (data, currency, since, limit);
    }

    /**
     * @method
     * @name htx#fetchLeverageTiers
     * @description retrieve information on the maximum leverage, and maintenance margin for trades of varying trade sizes
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols
     */
    async fetchLeverageTiers (symbols: Strings = undefined, params = {}): Promise<LeverageTiers> {
        await this.loadMarkets ();
        const response = await this.contractPublicGetLinearSwapApiV1SwapAdjustfactor (params);
        //
        //    {
        //        "status": "ok",
        //        "data": [
        //            {
        //                "symbol": "MANA",
        //                "contract_code": "MANA-USDT",
        //                "margin_mode": "isolated",
        //                "trade_partition": "USDT",
        //                "list": [
        //                    {
        //                        "lever_rate": 75,
        //                        "ladders": [
        //                            {
        //                                "ladder": 0,
        //                                "min_size": 0,
        //                                "max_size": 999,
        //                                "adjust_factor": 0.7
        //                            },
        //                            ...
        //                        ]
        //                    }
        //                    ...
        //                ]
        //            },
        //            ...
        //        ]
        //    }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseLeverageTiers (data, symbols, 'contract_code');
    }

    parseMarketLeverageTiers (info, market: Market = undefined): LeverageTier[] {
        const currencyId = this.safeString (info, 'trade_partition');
        const marketId = this.safeString (info, 'contract_code');
        const tiers = [];
        const brackets = this.safeList (info, 'list', []);
        for (let i = 0; i < brackets.length; i++) {
            const item = brackets[i];
            const leverage = this.safeString (item, 'lever_rate');
            const ladders = this.safeList (item, 'ladders', []);
            for (let k = 0; k < ladders.length; k++) {
                const bracket = ladders[k];
                const adjustFactor = this.safeString (bracket, 'adjust_factor');
                tiers.push ({
                    'tier': this.safeInteger (bracket, 'ladder'),
                    'symbol': this.safeSymbol (marketId, market, undefined, 'swap'),
                    'currency': this.safeCurrencyCode (currencyId),
                    'minNotional': this.safeNumber (bracket, 'min_size'),
                    'maxNotional': this.safeNumber (bracket, 'max_size'),
                    'maintenanceMarginRate': this.parseNumber (Precise.stringDiv (adjustFactor, leverage)),
                    'maxLeverage': this.parseNumber (leverage),
                    'info': bracket,
                });
            }
        }
        return tiers as LeverageTier[];
    }

    /**
     * @method
     * @name htx#fetchOpenInterestHistory
     * @description Retrieves the open interest history of a currency
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-information-on-open-interest
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-information-on-open-interest
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-information-on-open-interest
     * @param {string} symbol Unified CCXT market symbol
     * @param {string} timeframe '1h', '4h', '12h', or '1d'
     * @param {int} [since] Not used by huobi api, but response parsed by CCXT
     * @param {int} [limit] Default：48，Data Range [1,200]
     * @param {object} [params] Exchange specific parameters
     * @param {int} [params.amount_type] *required* Open interest unit. 1-cont，2-cryptocurrency
     * @param {int} [params.pair] eg BTC-USDT *Only for USDT-M*
     * @returns {object} an array of [open interest structures]{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterestHistory (symbol: string, timeframe = '1h', since: Int = undefined, limit: Int = undefined, params = {}) {
        if (timeframe !== '1h' && timeframe !== '4h' && timeframe !== '12h' && timeframe !== '1d') {
            throw new BadRequest (this.id + ' fetchOpenInterestHistory cannot only use the 1h, 4h, 12h and 1d timeframe');
        }
        await this.loadMarkets ();
        const timeframes: Dict = {
            '1h': '60min',
            '4h': '4hour',
            '12h': '12hour',
            '1d': '1day',
        };
        const market = this.market (symbol);
        const amountType = this.safeInteger2 (params, 'amount_type', 'amountType', 2);
        const request: Dict = {
            'period': timeframes[timeframe],
            'amount_type': amountType,
        };
        if (limit !== undefined) {
            request['size'] = limit;
        }
        let response = undefined;
        if (market['future']) {
            request['contract_type'] = this.safeString (market['info'], 'contract_type');
            request['symbol'] = market['baseId'];  // currency code on coin-m futures
            // coin-m futures
            response = await this.contractPublicGetApiV1ContractHisOpenInterest (this.extend (request, params));
        } else if (market['linear']) {
            request['contract_type'] = 'swap';
            request['contract_code'] = market['id'];
            request['contract_code'] = market['id'];
            // USDT-M
            response = await this.contractPublicGetLinearSwapApiV1SwapHisOpenInterest (this.extend (request, params));
        } else {
            request['contract_code'] = market['id'];
            // coin-m swaps
            response = await this.contractPublicGetSwapApiV1SwapHisOpenInterest (this.extend (request, params));
        }
        //
        //  contractPublicGetlinearSwapApiV1SwapHisOpenInterest
        //    {
        //        "status": "ok",
        //        "data": {
        //            "symbol": "BTC",
        //            "tick": [
        //                {
        //                    "volume": "4385.4350000000000000",
        //                    "amount_type": "2",
        //                    "ts": "1648220400000",
        //                    "value": "194059884.1850000000000000"
        //                },
        //                ...
        //            ],
        //            "contract_code": "BTC-USDT",
        //            "business_type": "swap",
        //            "pair": "BTC-USDT",
        //            "contract_type": "swap",
        //            "trade_partition": "USDT"
        //        },
        //        "ts": "1648223733007"
        //    }
        //
        //  contractPublicGetSwapApiV1SwapHisOpenInterest
        //    {
        //        "status": "ok",
        //        "data": {
        //            "symbol": "CRV",
        //            "tick": [
        //                {
        //                    "volume": 19174.0000000000000000,
        //                    "amount_type": 1,
        //                    "ts": 1648224000000
        //                },
        //                ...
        //            ],
        //            "contract_code": "CRV-USD"
        //        },
        //        "ts": 1648226554260
        //    }
        //
        //  contractPublicGetApiV1ContractHisOpenInterest
        //    {
        //         "status": "ok",
        //         "data": {
        //             "symbol": "BTC",
        //             "contract_type": "this_week",
        //             "tick": [
        //                {
        //                     "volume": "48419.0000000000000000",
        //                     "amount_type": 1,
        //                     "ts": 1648224000000
        //                },
        //                ...
        //            ]
        //        },
        //        "ts": 1648227062944
        //    }
        //
        const data = this.safeValue (response, 'data');
        const tick = this.safeList (data, 'tick');
        return this.parseOpenInterestsHistory (tick, market, since, limit);
    }

    /**
     * @method
     * @name htx#fetchOpenInterests
     * @description Retrieves the open interest for a list of symbols
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-contract-open-interest-information
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-swap-open-interest-information
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-swap-open-interest-information
     * @param {string[]} [symbols] a list of unified CCXT market symbols
     * @param {object} [params] exchange specific parameters
     * @returns {object[]} a list of [open interest structures]{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterests (symbols: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        let market = undefined;
        if (symbols !== undefined) {
            const symbolsLength = symbols.length;
            if (symbolsLength > 0) {
                const first = this.safeString (symbols, 0);
                market = this.market (first);
            }
        }
        const request: Dict = {};
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchPositions', market, params, 'linear');
        let marketType = undefined;
        [ marketType, params ] = this.handleMarketTypeAndParams ('fetchPositions', market, params);
        let response = undefined;
        if (marketType === 'future') {
            response = await this.contractPublicGetApiV1ContractOpenInterest (this.extend (request, params));
            //
            //     {
            //         "status": "ok",
            //         "data": [
            //             {
            //                 "volume": 118850.000000000000000000,
            //                 "amount": 635.502025211544374189,
            //                 "symbol": "BTC",
            //                 "contract_type": "this_week",
            //                 "contract_code": "BTC220930",
            //                 "trade_amount": 1470.9400749347598691119206024033947897351,
            //                 "trade_volume": 286286,
            //                 "trade_turnover": 28628600.000000000000000000
            //             }
            //         ],
            //         "ts": 1664337928805
            //     }
            //
        } else if (subType === 'inverse') {
            response = await this.contractPublicGetSwapApiV1SwapOpenInterest (this.extend (request, params));
            //
            //     {
            //         "status": "ok",
            //         "data": [
            //             {
            //                 "volume": 518018.000000000000000000,
            //                 "amount": 2769.675777407074725180,
            //                 "symbol": "BTC",
            //                 "contract_code": "BTC-USD",
            //                 "trade_amount": 9544.4032080046491323463688602729806842458,
            //                 "trade_volume": 1848448,
            //                 "trade_turnover": 184844800.000000000000000000
            //             }
            //         ],
            //         "ts": 1664337226028
            //     }
            //
        } else {
            request['contract_type'] = 'swap';
            response = await this.contractPublicGetLinearSwapApiV1SwapOpenInterest (this.extend (request, params));
            //
            //     {
            //         "status": "ok",
            //         "data": [
            //             {
            //                 "volume": 7192610.000000000000000000,
            //                 "amount": 7192.610000000000000000,
            //                 "symbol": "BTC",
            //                 "value": 134654290.332000000000000000,
            //                 "contract_code": "BTC-USDT",
            //                 "trade_amount": 70692.804,
            //                 "trade_volume": 70692804,
            //                 "trade_turnover": 1379302592.9518,
            //                 "business_type": "swap",
            //                 "pair": "BTC-USDT",
            //                 "contract_type": "swap",
            //                 "trade_partition": "USDT"
            //             }
            //         ],
            //         "ts": 1664336503144
            //     }
            //
        }
        const data = this.safeList (response, 'data', []);
        return this.parseOpenInterests (data, symbols) as OpenInterests;
    }

    /**
     * @method
     * @name htx#fetchOpenInterest
     * @description Retrieves the open interest of a currency
     * @see https://huobiapi.github.io/docs/dm/v1/en/#get-contract-open-interest-information
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#get-swap-open-interest-information
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-get-swap-open-interest-information
     * @param {string} symbol Unified CCXT market symbol
     * @param {object} [params] exchange specific parameters
     * @returns {object} an open interest structure{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterest (symbol: string, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['contract']) {
            throw new BadRequest (this.id + ' fetchOpenInterest() supports contract markets only');
        }
        if (market['option']) {
            throw new NotSupported (this.id + ' fetchOpenInterest() does not currently support option markets');
        }
        const request: Dict = {
            'contract_code': market['id'],
        };
        let response = undefined;
        if (market['future']) {
            request['contract_type'] = this.safeString (market['info'], 'contract_type');
            request['symbol'] = market['baseId'];
            // COIN-M futures
            response = await this.contractPublicGetApiV1ContractOpenInterest (this.extend (request, params));
        } else if (market['linear']) {
            request['contract_type'] = 'swap';
            // USDT-M
            response = await this.contractPublicGetLinearSwapApiV1SwapOpenInterest (this.extend (request, params));
        } else {
            // COIN-M swaps
            response = await this.contractPublicGetSwapApiV1SwapOpenInterest (this.extend (request, params));
        }
        //
        // USDT-M contractPublicGetLinearSwapApiV1SwapOpenInterest
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "volume": 7192610.000000000000000000,
        //                 "amount": 7192.610000000000000000,
        //                 "symbol": "BTC",
        //                 "value": 134654290.332000000000000000,
        //                 "contract_code": "BTC-USDT",
        //                 "trade_amount": 70692.804,
        //                 "trade_volume": 70692804,
        //                 "trade_turnover": 1379302592.9518,
        //                 "business_type": "swap",
        //                 "pair": "BTC-USDT",
        //                 "contract_type": "swap",
        //                 "trade_partition": "USDT"
        //             }
        //         ],
        //         "ts": 1664336503144
        //     }
        //
        // COIN-M Swap contractPublicGetSwapApiV1SwapOpenInterest
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "volume": 518018.000000000000000000,
        //                 "amount": 2769.675777407074725180,
        //                 "symbol": "BTC",
        //                 "contract_code": "BTC-USD",
        //                 "trade_amount": 9544.4032080046491323463688602729806842458,
        //                 "trade_volume": 1848448,
        //                 "trade_turnover": 184844800.000000000000000000
        //             }
        //         ],
        //         "ts": 1664337226028
        //     }
        //
        // COIN-M Futures contractPublicGetApiV1ContractOpenInterest
        //
        //     {
        //         "status": "ok",
        //         "data": [
        //             {
        //                 "volume": 118850.000000000000000000,
        //                 "amount": 635.502025211544374189,
        //                 "symbol": "BTC",
        //                 "contract_type": "this_week",
        //                 "contract_code": "BTC220930",
        //                 "trade_amount": 1470.9400749347598691119206024033947897351,
        //                 "trade_volume": 286286,
        //                 "trade_turnover": 28628600.000000000000000000
        //             }
        //         ],
        //         "ts": 1664337928805
        //     }
        //
        const data = this.safeValue (response, 'data', []);
        const openInterest = this.parseOpenInterest (data[0], market);
        const timestamp = this.safeInteger (response, 'ts');
        openInterest['timestamp'] = timestamp;
        openInterest['datetime'] = this.iso8601 (timestamp);
        return openInterest;
    }

    parseOpenInterest (interest, market: Market = undefined) {
        //
        // fetchOpenInterestHistory
        //
        //    {
        //        "volume": "4385.4350000000000000",
        //        "amount_type": "2",
        //        "ts": "1648220400000",
        //        "value": "194059884.1850000000000000"
        //    }
        //
        // fetchOpenInterest: USDT-M
        //
        //     {
        //         "volume": 7192610.000000000000000000,
        //         "amount": 7192.610000000000000000,
        //         "symbol": "BTC",
        //         "value": 134654290.332000000000000000,
        //         "contract_code": "BTC-USDT",
        //         "trade_amount": 70692.804,
        //         "trade_volume": 70692804,
        //         "trade_turnover": 1379302592.9518,
        //         "business_type": "swap",
        //         "pair": "BTC-USDT",
        //         "contract_type": "swap",
        //         "trade_partition": "USDT"
        //     }
        //
        // fetchOpenInterest: COIN-M Swap
        //
        //     {
        //         "volume": 518018.000000000000000000,
        //         "amount": 2769.675777407074725180,
        //         "symbol": "BTC",
        //         "contract_code": "BTC-USD",
        //         "trade_amount": 9544.4032080046491323463688602729806842458,
        //         "trade_volume": 1848448,
        //         "trade_turnover": 184844800.000000000000000000
        //     }
        //
        // fetchOpenInterest: COIN-M Futures
        //
        //     {
        //         "volume": 118850.000000000000000000,
        //         "amount": 635.502025211544374189,
        //         "symbol": "BTC",
        //         "contract_type": "this_week",
        //         "contract_code": "BTC220930",
        //         "trade_amount": 1470.9400749347598691119206024033947897351,
        //         "trade_volume": 286286,
        //         "trade_turnover": 28628600.000000000000000000
        //     }
        //
        const timestamp = this.safeInteger (interest, 'ts');
        const amount = this.safeNumber (interest, 'volume');
        const value = this.safeNumber (interest, 'value');
        const marketId = this.safeString (interest, 'contract_code');
        return this.safeOpenInterest ({
            'symbol': this.safeSymbol (marketId, market),
            'baseVolume': amount,  // deprecated
            'quoteVolume': value,  // deprecated
            'openInterestAmount': amount,
            'openInterestValue': value,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': interest,
        }, market);
    }

    /**
     * @method
     * @name htx#borrowIsolatedMargin
     * @description create a loan to borrow margin
     * @see https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-isolated
     * @see https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-cross
     * @param {string} symbol unified market symbol, required for isolated margin
     * @param {string} code unified currency code of the currency to borrow
     * @param {float} amount the amount to borrow
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async borrowIsolatedMargin (symbol: string, code: string, amount: number, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const market = this.market (symbol);
        const request: Dict = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'symbol': market['id'],
        };
        const response = await this.privatePostMarginOrders (this.extend (request, params));
        //
        // Isolated
        //
        //     {
        //         "data": 1000
        //     }
        //
        const transaction = this.parseMarginLoan (response, currency);
        return this.extend (transaction, {
            'amount': amount,
            'symbol': symbol,
        });
    }

    /**
     * @method
     * @name htx#borrowCrossMargin
     * @description create a loan to borrow margin
     * @see https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-isolated
     * @see https://huobiapi.github.io/docs/spot/v1/en/#request-a-margin-loan-cross
     * @param {string} code unified currency code of the currency to borrow
     * @param {float} amount the amount to borrow
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async borrowCrossMargin (code: string, amount: number, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
        };
        const response = await this.privatePostCrossMarginOrders (this.extend (request, params));
        //
        // Cross
        //
        //     {
        //         "status": "ok",
        //         "data": null
        //     }
        //
        const transaction = this.parseMarginLoan (response, currency);
        return this.extend (transaction, {
            'amount': amount,
        });
    }

    /**
     * @method
     * @name htx#repayIsolatedMargin
     * @description repay borrowed margin and interest
     * @see https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross-isolated
     * @param {string} symbol unified market symbol
     * @param {string} code unified currency code of the currency to repay
     * @param {float} amount the amount to repay
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async repayIsolatedMargin (symbol: string, code: string, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const accountId = await this.fetchAccountIdByType ('spot', 'isolated', symbol, params);
        const request: Dict = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'accountId': accountId,
        };
        const response = await this.v2PrivatePostAccountRepayment (this.extend (request, params));
        //
        //     {
        //         "code":200,
        //         "data": [
        //             {
        //                 "repayId":1174424,
        //                 "repayTime":1600747722018
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'Data', []);
        const loan = this.safeValue (data, 0);
        const transaction = this.parseMarginLoan (loan, currency);
        return this.extend (transaction, {
            'amount': amount,
            'symbol': symbol,
        });
    }

    /**
     * @method
     * @name htx#repayCrossMargin
     * @description repay borrowed margin and interest
     * @see https://huobiapi.github.io/docs/spot/v1/en/#repay-margin-loan-cross-isolated
     * @param {string} code unified currency code of the currency to repay
     * @param {float} amount the amount to repay
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async repayCrossMargin (code: string, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const accountId = await this.fetchAccountIdByType ('spot', 'cross', undefined, params);
        const request: Dict = {
            'currency': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'accountId': accountId,
        };
        const response = await this.v2PrivatePostAccountRepayment (this.extend (request, params));
        //
        //     {
        //         "code":200,
        //         "data": [
        //             {
        //                 "repayId":1174424,
        //                 "repayTime":1600747722018
        //             }
        //         ]
        //     }
        //
        const data = this.safeValue (response, 'Data', []);
        const loan = this.safeValue (data, 0);
        const transaction = this.parseMarginLoan (loan, currency);
        return this.extend (transaction, {
            'amount': amount,
        });
    }

    parseMarginLoan (info, currency: Currency = undefined) {
        //
        // borrowMargin cross
        //
        //     {
        //         "status": "ok",
        //         "data": null
        //     }
        //
        // borrowMargin isolated
        //
        //     {
        //         "data": 1000
        //     }
        //
        // repayMargin
        //
        //     {
        //         "repayId":1174424,
        //         "repayTime":1600747722018
        //     }
        //
        const timestamp = this.safeInteger (info, 'repayTime');
        return {
            'id': this.safeString2 (info, 'repayId', 'data'),
            'currency': this.safeCurrencyCode (undefined, currency),
            'amount': undefined,
            'symbol': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': info,
        };
    }

    /**
     * @method
     * @name htx#fetchSettlementHistory
     * @description Fetches historical settlement records
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-historical-settlement-records-of-the-platform-interface
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-historical-settlement-records-of-the-platform-interface
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-historical-settlement-records-of-the-platform-interface
     * @param {string} symbol unified symbol of the market to fetch the settlement history for
     * @param {int} [since] timestamp in ms, value range = current time - 90 days，default = current time - 90 days
     * @param {int} [limit] page items, default 20, shall not exceed 50
     * @param {object} [params] exchange specific params
     * @param {int} [params.until] timestamp in ms, value range = start_time -> current time，default = current time
     * @param {int} [params.page_index] page index, default page 1 if not filled
     * @param {int} [params.code] unified currency code, can be used when symbol is undefined
     * @returns {object[]} a list of [settlement history objects]{@link https://docs.ccxt.com/#/?id=settlement-history-structure}
     */
    async fetchSettlementHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchSettlementHistory() requires a symbol argument');
        }
        const until = this.safeInteger (params, 'until');
        params = this.omit (params, [ 'until' ]);
        const market = this.market (symbol);
        const request: Dict = {};
        if (market['future']) {
            request['symbol'] = market['baseId'];
        } else {
            request['contract_code'] = market['id'];
        }
        if (since !== undefined) {
            request['start_at'] = since;
        }
        if (limit !== undefined) {
            request['page_size'] = limit;
        }
        if (until !== undefined) {
            request['end_at'] = until;
        }
        let response = undefined;
        if (market['swap']) {
            if (market['linear']) {
                response = await this.contractPublicGetLinearSwapApiV1SwapSettlementRecords (this.extend (request, params));
            } else {
                response = await this.contractPublicGetSwapApiV1SwapSettlementRecords (this.extend (request, params));
            }
        } else {
            response = await this.contractPublicGetApiV1ContractSettlementRecords (this.extend (request, params));
        }
        //
        // linear swap, coin-m swap
        //
        //    {
        //        "status": "ok",
        //        "data": {
        //        "total_page": 14,
        //        "current_page": 1,
        //        "total_size": 270,
        //        "settlement_record": [
        //            {
        //                "symbol": "ADA",
        //                "contract_code": "ADA-USDT",
        //                "settlement_time": 1652313600000,
        //                "clawback_ratio": 0E-18,
        //                "settlement_price": 0.512303000000000000,
        //                "settlement_type": "settlement",
        //                "business_type": "swap",
        //                "pair": "ADA-USDT",
        //                "trade_partition": "USDT"
        //            },
        //            ...
        //        ],
        //        "ts": 1652338693256
        //    }
        //
        // coin-m future
        //
        //    {
        //        "status": "ok",
        //        "data": {
        //            "total_page": 5,
        //            "current_page": 1,
        //            "total_size": 90,
        //            "settlement_record": [
        //                {
        //                    "symbol": "FIL",
        //                    "settlement_time": 1652342400000,
        //                    "clawback_ratio": 0E-18,
        //                    "list": [
        //                        {
        //                            "contract_code": "FIL220513",
        //                            "settlement_price": 7.016000000000000000,
        //                            "settlement_type": "settlement"
        //                        },
        //                        ...
        //                    ]
        //                },
        //            ]
        //        }
        //    }
        //
        const data = this.safeValue (response, 'data');
        const settlementRecord = this.safeValue (data, 'settlement_record');
        const settlements = this.parseSettlements (settlementRecord, market);
        return this.sortBy (settlements, 'timestamp');
    }

    /**
     * @method
     * @name htx#fetchDepositWithdrawFees
     * @description fetch deposit and withdraw fees
     * @see https://huobiapi.github.io/docs/spot/v1/en/#get-all-supported-currencies-v2
     * @param {string[]|undefined} codes list of unified currency codes
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [fees structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchDepositWithdrawFees (codes: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.spotPublicGetV2ReferenceCurrencies (params);
        //
        //    {
        //        "code": 200,
        //        "data": [
        //            {
        //                "currency": "sxp",
        //                "assetType": "1",
        //                "chains": [
        //                    {
        //                        "chain": "sxp",
        //                        "displayName": "ERC20",
        //                        "baseChain": "ETH",
        //                        "baseChainProtocol": "ERC20",
        //                        "isDynamic": true,
        //                        "numOfConfirmations": "12",
        //                        "numOfFastConfirmations": "12",
        //                        "depositStatus": "allowed",
        //                        "minDepositAmt": "0.23",
        //                        "withdrawStatus": "allowed",
        //                        "minWithdrawAmt": "0.23",
        //                        "withdrawPrecision": "8",
        //                        "maxWithdrawAmt": "227000.000000000000000000",
        //                        "withdrawQuotaPerDay": "227000.000000000000000000",
        //                        "withdrawQuotaPerYear": null,
        //                        "withdrawQuotaTotal": null,
        //                        "withdrawFeeType": "fixed",
        //                        "transactFeeWithdraw": "11.1653",
        //                        "addrWithTag": false,
        //                        "addrDepositTag": false
        //                    }
        //                ],
        //                "instStatus": "normal"
        //            }
        //        ]
        //    }
        //
        const data = this.safeList (response, 'data');
        return this.parseDepositWithdrawFees (data, codes, 'currency');
    }

    parseDepositWithdrawFee (fee, currency: Currency = undefined) {
        //
        //            {
        //              "currency": "sxp",
        //              "assetType": "1",
        //              "chains": [
        //                  {
        //                      "chain": "sxp",
        //                      "displayName": "ERC20",
        //                      "baseChain": "ETH",
        //                      "baseChainProtocol": "ERC20",
        //                      "isDynamic": true,
        //                      "numOfConfirmations": "12",
        //                      "numOfFastConfirmations": "12",
        //                      "depositStatus": "allowed",
        //                      "minDepositAmt": "0.23",
        //                      "withdrawStatus": "allowed",
        //                      "minWithdrawAmt": "0.23",
        //                      "withdrawPrecision": "8",
        //                      "maxWithdrawAmt": "227000.000000000000000000",
        //                      "withdrawQuotaPerDay": "227000.000000000000000000",
        //                      "withdrawQuotaPerYear": null,
        //                      "withdrawQuotaTotal": null,
        //                      "withdrawFeeType": "fixed",
        //                      "transactFeeWithdraw": "11.1653",
        //                      "addrWithTag": false,
        //                      "addrDepositTag": false
        //                  }
        //              ],
        //              "instStatus": "normal"
        //          }
        //
        const chains = this.safeValue (fee, 'chains', []);
        let result = this.depositWithdrawFee (fee);
        for (let j = 0; j < chains.length; j++) {
            const chainEntry = chains[j];
            const networkId = this.safeString (chainEntry, 'chain');
            const withdrawFeeType = this.safeString (chainEntry, 'withdrawFeeType');
            const networkCode = this.networkIdToCode (networkId);
            let withdrawFee = undefined;
            let withdrawResult = undefined;
            if (withdrawFeeType === 'fixed') {
                withdrawFee = this.safeNumber (chainEntry, 'transactFeeWithdraw');
                withdrawResult = {
                    'fee': withdrawFee,
                    'percentage': false,
                };
            } else {
                withdrawFee = this.safeNumber (chainEntry, 'transactFeeRateWithdraw');
                withdrawResult = {
                    'fee': withdrawFee,
                    'percentage': true,
                };
            }
            result['networks'][networkCode] = {
                'withdraw': withdrawResult,
                'deposit': {
                    'fee': undefined,
                    'percentage': undefined,
                },
            };
            result = this.assignDefaultDepositWithdrawFees (result, currency);
        }
        return result;
    }

    parseSettlements (settlements, market) {
        //
        // linear swap, coin-m swap, fetchSettlementHistory
        //
        //    [
        //        {
        //            "symbol": "ADA",
        //            "contract_code": "ADA-USDT",
        //            "settlement_time": 1652313600000,
        //            "clawback_ratio": 0E-18,
        //            "settlement_price": 0.512303000000000000,
        //            "settlement_type": "settlement",
        //            "business_type": "swap",
        //            "pair": "ADA-USDT",
        //            "trade_partition": "USDT"
        //        },
        //        ...
        //    ]
        //
        // coin-m future, fetchSettlementHistory
        //
        //    [
        //        {
        //            "symbol": "FIL",
        //            "settlement_time": 1652342400000,
        //            "clawback_ratio": 0E-18,
        //            "list": [
        //                {
        //                    "contract_code": "FIL220513",
        //                    "settlement_price": 7.016000000000000000,
        //                    "settlement_type": "settlement"
        //                },
        //                ...
        //            ]
        //        },
        //    ]
        //
        const result = [];
        for (let i = 0; i < settlements.length; i++) {
            const settlement = settlements[i];
            const list = this.safeValue (settlement, 'list');
            if (list !== undefined) {
                const timestamp = this.safeInteger (settlement, 'settlement_time');
                const timestampDetails: Dict = {
                    'timestamp': timestamp,
                    'datetime': this.iso8601 (timestamp),
                };
                for (let j = 0; j < list.length; j++) {
                    const item = list[j];
                    const parsedSettlement = this.parseSettlement (item, market);
                    result.push (this.extend (parsedSettlement, timestampDetails));
                }
            } else {
                result.push (this.parseSettlement (settlements[i], market));
            }
        }
        return result;
    }

    parseSettlement (settlement, market) {
        //
        // linear swap, coin-m swap, fetchSettlementHistory
        //
        //    {
        //        "symbol": "ADA",
        //        "contract_code": "ADA-USDT",
        //        "settlement_time": 1652313600000,
        //        "clawback_ratio": 0E-18,
        //        "settlement_price": 0.512303000000000000,
        //        "settlement_type": "settlement",
        //        "business_type": "swap",
        //        "pair": "ADA-USDT",
        //        "trade_partition": "USDT"
        //    }
        //
        // coin-m future, fetchSettlementHistory
        //
        //    {
        //        "contract_code": "FIL220513",
        //        "settlement_price": 7.016000000000000000,
        //        "settlement_type": "settlement"
        //    }
        //
        const timestamp = this.safeInteger (settlement, 'settlement_time');
        const marketId = this.safeString (settlement, 'contract_code');
        return {
            'info': settlement,
            'symbol': this.safeSymbol (marketId, market),
            'price': this.safeNumber (settlement, 'settlement_price'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
    }

    /**
     * @method
     * @name htx#fetchLiquidations
     * @description retrieves the public liquidations of a trading pair
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#general-query-liquidation-orders-new
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#query-liquidation-orders-new
     * @see https://huobiapi.github.io/docs/dm/v1/en/#query-liquidation-order-information-new
     * @param {string} symbol unified CCXT market symbol
     * @param {int} [since] the earliest time in ms to fetch liquidations for
     * @param {int} [limit] the maximum number of liquidation structures to retrieve
     * @param {object} [params] exchange specific parameters for the huobi api endpoint
     * @param {int} [params.until] timestamp in ms of the latest liquidation
     * @param {int} [params.tradeType] default 0, linear swap 0: all liquidated orders, 5: liquidated longs; 6: liquidated shorts, inverse swap and future 0: filled liquidated orders, 5: liquidated close orders, 6: liquidated open orders
     * @returns {object} an array of [liquidation structures]{@link https://docs.ccxt.com/#/?id=liquidation-structure}
     */
    async fetchLiquidations (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const tradeType = this.safeInteger (params, 'trade_type', 0);
        let request: Dict = {
            'trade_type': tradeType,
        };
        if (since !== undefined) {
            request['start_time'] = since;
        }
        [ request, params ] = this.handleUntilOption ('end_time', request, params);
        let response = undefined;
        if (market['swap']) {
            request['contract'] = market['id'];
            if (market['linear']) {
                response = await this.contractPublicGetLinearSwapApiV3SwapLiquidationOrders (this.extend (request, params));
            } else {
                response = await this.contractPublicGetSwapApiV3SwapLiquidationOrders (this.extend (request, params));
            }
        } else if (market['future']) {
            request['symbol'] = market['id'];
            response = await this.contractPublicGetApiV3ContractLiquidationOrders (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchLiquidations() does not support ' + market['type'] + ' orders');
        }
        //
        //     {
        //         "code": 200,
        //         "msg": "",
        //         "data": [
        //             {
        //                 "query_id": 452057,
        //                 "contract_code": "BTC-USDT-211210",
        //                 "symbol": "USDT",
        //                 "direction": "sell",
        //                 "offset": "close",
        //                 "volume": 479.000000000000000000,
        //                 "price": 51441.700000000000000000,
        //                 "created_at": 1638593647864,
        //                 "amount": 0.479000000000000000,
        //                 "trade_turnover": 24640.574300000000000000,
        //                 "business_type": "futures",
        //                 "pair": "BTC-USDT"
        //             }
        //         ],
        //         "ts": 1604312615051
        //     }
        //
        const data = this.safeList (response, 'data', []);
        return this.parseLiquidations (data, market, since, limit);
    }

    parseLiquidation (liquidation, market: Market = undefined) {
        //
        //     {
        //         "query_id": 452057,
        //         "contract_code": "BTC-USDT-211210",
        //         "symbol": "USDT",
        //         "direction": "sell",
        //         "offset": "close",
        //         "volume": 479.000000000000000000,
        //         "price": 51441.700000000000000000,
        //         "created_at": 1638593647864,
        //         "amount": 0.479000000000000000,
        //         "trade_turnover": 24640.574300000000000000,
        //         "business_type": "futures",
        //         "pair": "BTC-USDT"
        //     }
        //
        const marketId = this.safeString (liquidation, 'contract_code');
        const timestamp = this.safeInteger (liquidation, 'created_at');
        return this.safeLiquidation ({
            'info': liquidation,
            'symbol': this.safeSymbol (marketId, market),
            'contracts': this.safeNumber (liquidation, 'volume'),
            'contractSize': this.safeNumber (market, 'contractSize'),
            'price': this.safeNumber (liquidation, 'price'),
            'baseValue': this.safeNumber (liquidation, 'amount'),
            'quoteValue': this.safeNumber (liquidation, 'trade_turnover'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        });
    }

    /**
     * @method
     * @name htx#closePositions
     * @description closes open positions for a contract market, requires 'amount' in params, unlike other exchanges
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-place-lightning-close-order  // USDT-M (isolated)
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-place-lightning-close-position  // USDT-M (cross)
     * @see https://huobiapi.github.io/docs/coin_margined_swap/v1/en/#place-lightning-close-order  // Coin-M swap
     * @see https://huobiapi.github.io/docs/dm/v1/en/#place-flash-close-order                      // Coin-M futures
     * @param {string} symbol unified CCXT market symbol
     * @param {string} side 'buy' or 'sell', the side of the closing order, opposite side as position side
     * @param {object} [params] extra parameters specific to the okx api endpoint
     * @param {string} [params.clientOrderId] client needs to provide unique API and have to maintain the API themselves afterwards. [1, 9223372036854775807]
     * @param {object} [params.marginMode] 'cross' or 'isolated', required for linear markets
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {number} [params.amount] order quantity
     * @param {string} [params.order_price_type] 'lightning' by default, 'lightning_fok': lightning fok type, 'lightning_ioc': lightning ioc type 'market' by default, 'market': market order type, 'lightning_fok': lightning
     * @returns {object} [an order structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async closePosition (symbol: string, side: OrderSide = undefined, params = {}): Promise<Order> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const clientOrderId = this.safeString (params, 'clientOrderId');
        if (!market['contract']) {
            throw new BadRequest (this.id + ' closePosition() symbol supports contract markets only');
        }
        this.checkRequiredArgument ('closePosition', side, 'side');
        const request: Dict = {
            'contract_code': market['id'],
            'direction': side,
        };
        if (clientOrderId !== undefined) {
            request['client_order_id'] = clientOrderId;
        }
        if (market['inverse']) {
            const amount = this.safeString2 (params, 'volume', 'amount');
            if (amount === undefined) {
                throw new ArgumentsRequired (this.id + ' closePosition () requires an extra argument params["amount"] for inverse markets');
            }
            request['volume'] = this.amountToPrecision (symbol, amount);
        }
        params = this.omit (params, [ 'clientOrderId', 'volume', 'amount' ]);
        let response = undefined;
        if (market['inverse']) {  // Coin-M
            if (market['swap']) {
                response = await this.contractPrivatePostSwapApiV1SwapLightningClosePosition (this.extend (request, params));
            } else {  // future
                response = await this.contractPrivatePostApiV1LightningClosePosition (this.extend (request, params));
            }
        } else {  // USDT-M
            let marginMode = undefined;
            [ marginMode, params ] = this.handleMarginModeAndParams ('closePosition', params, 'cross');
            if (marginMode === 'cross') {
                response = await this.contractPrivatePostLinearSwapApiV1SwapCrossLightningClosePosition (this.extend (request, params));
            } else {  // isolated
                response = await this.contractPrivatePostLinearSwapApiV1SwapLightningClosePosition (this.extend (request, params));
            }
        }
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name htx#setPositionMode
     * @description set hedged to true or false
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#isolated-switch-position-mode
     * @see https://huobiapi.github.io/docs/usdt_swap/v1/en/#cross-switch-position-mode
     * @param {bool} hedged set to true to for hedged mode, must be set separately for each market in isolated margin mode, only valid for linear markets
     * @param {string} [symbol] unified market symbol, required for isolated margin mode
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] "cross" (default) or "isolated"
     * @returns {object} response from the exchange
     */
    async setPositionMode (hedged: boolean, symbol: Str = undefined, params = {}) {
        await this.loadMarkets ();
        const posMode = hedged ? 'dual_side' : 'single_side';
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('setPositionMode', params, 'cross');
        const request: Dict = {
            'position_mode': posMode,
        };
        let response = undefined;
        if ((market !== undefined) && (market['inverse'])) {
            throw new BadRequest (this.id + ' setPositionMode can only be used for linear markets');
        }
        if (marginMode === 'isolated') {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' setPositionMode requires a symbol argument for isolated margin mode');
            }
            request['margin_account'] = market['id'];
            response = await this.contractPrivatePostLinearSwapApiV1SwapSwitchPositionMode (this.extend (request, params));
            //
            //    {
            //        "status": "ok",
            //        "data": [
            //            {
            //                "margin_account": "BTC-USDT",
            //                "position_mode": "single_side"
            //            }
            //        ],
            //        "ts": 1566899973811
            //    }
            //
        } else {
            request['margin_account'] = 'USDT';
            response = await this.contractPrivatePostLinearSwapApiV1SwapCrossSwitchPositionMode (this.extend (request, params));
            //
            //    {
            //        "status": "ok",
            //        "data": [
            //            {
            //                "margin_account": "USDT",
            //                "position_mode": "single_side"
            //            }
            //        ],
            //        "ts": 1566899973811
            //    }
            //
        }
        return response;
    }
}
