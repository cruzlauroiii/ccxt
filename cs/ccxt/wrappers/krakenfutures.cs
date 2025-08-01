namespace ccxt;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code


public partial class krakenfutures
{
    /// <summary>
    /// Fetches the available trading markets from the exchange, Multi-collateral markets are returned as linear markets, but can be settled in multiple currencies
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-instrument-details-get-instruments"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : exchange specific params
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<MarketInterface>> FetchMarkets(Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchMarkets(parameters);
        return ((IList<object>)res).Select(item => new MarketInterface(item)).ToList<MarketInterface>();
    }
    /// <summary>
    /// Fetches a list of open orders in a market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-market-data-get-orderbook"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : Not used by krakenfutures
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : exchange specific params
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<OrderBook> FetchOrderBook(string symbol, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchOrderBook(symbol, limit, parameters);
        return new OrderBook(res);
    }
    /// <summary>
    /// fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-market-data-get-tickers"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> an array of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}.</returns>
    public async Task<Tickers> FetchTickers(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchTickers(symbols, parameters);
        return new Tickers(res);
    }
    /// <summary>
    /// fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-charts-candles"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : timestamp in ms of the earliest candle to fetch
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum amount of candles to fetch
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.paginate</term>
    /// <description>
    /// boolean : default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>int[][]</term> A list of candles ordered as timestamp, open, high, low, close, volume.</returns>
    public async Task<List<OHLCV>> FetchOHLCV(string symbol, string timeframe = "1m", Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchOHLCV(symbol, timeframe, since, limit, parameters);
        return ((IList<object>)res).Select(item => new OHLCV(item)).ToList<OHLCV>();
    }
    /// <summary>
    /// Fetch a history of filled trades that this account has made
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-market-data-get-trade-history"/>  <br/>
    /// See <see href="https://docs.futures.kraken.com/#http-api-history-market-history-get-public-execution-events"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : Timestamp in ms of earliest trade. Not used by krakenfutures except in combination with params.until
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : Total number of trades, cannot exceed 100
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific params
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.until</term>
    /// <description>
    /// int : Timestamp in ms of latest trade
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.paginate</term>
    /// <description>
    /// boolean : default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.method</term>
    /// <description>
    /// string : The method to use to fetch trades. Can be 'historyGetMarketSymbolExecutions' or 'publicGetHistory' default is 'historyGetMarketSymbolExecutions'
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Trade>> FetchTrades(string symbol, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    public Dictionary<string, object> CreateOrderRequest(string symbol, string type, string side, double amount, double? price2 = 0, Dictionary<string, object> parameters = null)
    {
        var price = price2 == 0 ? null : (object)price2;
        var res = this.createOrderRequest(symbol, type, side, amount, price, parameters);
        return ((Dictionary<string, object>)res);
    }
    /// <summary>
    /// Create an order on the exchange
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.kraken.com/api/docs/futures-api/trading/send-order"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>price</term>
    /// <description>
    /// float : limit order price
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.reduceOnly</term>
    /// <description>
    /// bool : set as true if you wish the order to only reduce an existing position, any order which increases an existing position will be rejected, default is false
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.postOnly</term>
    /// <description>
    /// bool : set as true if you wish to make a postOnly order, default is false
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.clientOrderId</term>
    /// <description>
    /// string : UUID The order identity that is specified from the user, It must be globally unique
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.triggerPrice</term>
    /// <description>
    /// float : the price that a stop order is triggered at
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.stopLossPrice</term>
    /// <description>
    /// float : the price that a stop loss order is triggered at
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.takeProfitPrice</term>
    /// <description>
    /// float : the price that a take profit order is triggered at
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.triggerSignal</term>
    /// <description>
    /// string : for triggerPrice, stopLossPrice and takeProfitPrice orders, the trigger price type, 'last', 'mark' or 'index', default is 'last'
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}.</returns>
    public async Task<Order> CreateOrder(string symbol, string type, string side, double amount, double? price2 = 0, Dictionary<string, object> parameters = null)
    {
        var price = price2 == 0 ? null : (object)price2;
        var res = await this.createOrder(symbol, type, side, amount, price, parameters);
        return new Order(res);
    }
    /// <summary>
    /// create a list of trade orders
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.kraken.com/api/docs/futures-api/trading/send-batch-order"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}.</returns>
    public async Task<List<Order>> CreateOrders(List<OrderRequest> orders, Dictionary<string, object> parameters = null)
    {
        var res = await this.createOrders(orders, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// Edit an open order on the exchange
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-edit-order"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>price</term>
    /// <description>
    /// float : Price to fill order at
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific params
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<Order> EditOrder(string id, string symbol, string type, string side, double? amount2 = 0, double? price2 = 0, Dictionary<string, object> parameters = null)
    {
        var amount = amount2 == 0 ? null : (object)amount2;
        var price = price2 == 0 ? null : (object)price2;
        var res = await this.editOrder(id, symbol, type, side, amount, price, parameters);
        return new Order(res);
    }
    /// <summary>
    /// Cancel an open order on the exchange
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-cancel-order"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific params
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<Order> CancelOrder(string id, string symbol = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.cancelOrder(id, symbol, parameters);
        return new Order(res);
    }
    /// <summary>
    /// cancel multiple orders
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-batch-order-management"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>symbol</term>
    /// <description>
    /// string : unified market symbol
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}.</returns>
    public async Task<List<Order>> CancelOrders(List<string> ids, string symbol = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.cancelOrders(ids, symbol, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// Cancels all orders on the exchange, including trigger orders
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-cancel-all-orders"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// dict : Exchange specific params
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Order>> CancelAllOrders(string symbol = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.cancelAllOrders(symbol, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// dead man's switch, cancel all orders after the given timeout
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-dead-man-39-s-switch"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> the api result.</returns>
    public async Task<Dictionary<string, object>> CancelAllOrdersAfter(Int64 timeout, Dictionary<string, object> parameters = null)
    {
        var res = await this.cancelAllOrdersAfter(timeout, parameters);
        return ((Dictionary<string, object>)res);
    }
    /// <summary>
    /// Gets all open orders, including trigger orders, for an account from the exchange api
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-order-management-get-open-orders"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : Timestamp (ms) of earliest order. (Not used by kraken api but filtered internally by CCXT)
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : How many orders to return. (Not used by kraken api but filtered internally by CCXT)
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific parameters
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Order>> FetchOpenOrders(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchOpenOrders(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// Gets all closed orders, including trigger orders, for an account from the exchange api
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-history-account-history-get-order-events"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : Timestamp (ms) of earliest order.
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : How many orders to return.
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific parameters
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Order>> FetchClosedOrders(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchClosedOrders(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// Gets all canceled orders, including trigger orders, for an account from the exchange api
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-history-account-history-get-order-events"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : Timestamp (ms) of earliest order.
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : How many orders to return.
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific parameters
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Order>> FetchCanceledOrders(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchCanceledOrders(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Order(item)).ToList<Order>();
    }
    /// <summary>
    /// fetch all trades made by the user
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-historical-data-get-your-fills"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : *not used by the  api* the earliest time in ms to fetch trades for
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum number of trades structures to retrieve
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.until</term>
    /// <description>
    /// int : the latest time in ms to fetch entries for
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>Trade[]</term> a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}.</returns>
    public async Task<List<Trade>> FetchMyTrades(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchMyTrades(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new Trade(item)).ToList<Trade>();
    }
    /// <summary>
    /// Fetch the balance for a sub-account, all sub-account balances are inside 'info' in the response
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-account-information-get-wallets"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific parameters
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.type</term>
    /// <description>
    /// string : The sub-account type to query the balance of, possible values include 'flex', 'cash'/'main'/'funding', or a market symbol * defaults to 'flex' *
    /// </description>
    /// </item>
    /// <item>
    /// <term>params.symbol</term>
    /// <description>
    /// string : A unified market symbol, when assigned the balance for a trading market that matches the symbol is returned
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<Balances> FetchBalance(Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchBalance(parameters);
        return new Balances(res);
    }
    /// <summary>
    /// fetch the current funding rates for multiple markets
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-market-data-get-tickers"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>Order[]</term> an array of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}.</returns>
    public async Task<FundingRates> FetchFundingRates(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchFundingRates(symbols, parameters);
        return new FundingRates(res);
    }
    /// <summary>
    /// fetches historical funding rate prices
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-historical-funding-rates-historical-funding-rates"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>since</term>
    /// <description>
    /// int : timestamp in ms of the earliest funding rate to fetch
    /// </description>
    /// </item>
    /// <item>
    /// <term>limit</term>
    /// <description>
    /// int : the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure} to fetch
    /// </description>
    /// </item>
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the api endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object[]</term> a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}.</returns>
    public async Task<List<FundingRateHistory>> FetchFundingRateHistory(string symbol = null, Int64? since2 = 0, Int64? limit2 = 0, Dictionary<string, object> parameters = null)
    {
        var since = since2 == 0 ? null : (object)since2;
        var limit = limit2 == 0 ? null : (object)limit2;
        var res = await this.fetchFundingRateHistory(symbol, since, limit, parameters);
        return ((IList<object>)res).Select(item => new FundingRateHistory(item)).ToList<FundingRateHistory>();
    }
    /// <summary>
    /// Fetches current contract trading positions
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-account-information-get-open-positions"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Not used by krakenfutures
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<List<Position>> FetchPositions(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchPositions(symbols, parameters);
        return ((IList<object>)res).Select(item => new Position(item)).ToList<Position>();
    }
    /// <summary>
    /// retrieve information on the maximum leverage, and maintenance margin for trades of varying trade sizes
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-instrument-details-get-instruments"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols.</returns>
    public async Task<LeverageTiers> FetchLeverageTiers(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchLeverageTiers(symbols, parameters);
        return new LeverageTiers(res);
    }
    /// <summary>
    /// transfer from futures wallet to spot wallet
    /// </summary>
    /// <remarks>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// dict : Exchange specific parameters
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<TransferEntry> TransferOut(string code, object amount, Dictionary<string, object> parameters = null)
    {
        var res = await this.transferOut(code, amount, parameters);
        return new TransferEntry(res);
    }
    /// <summary>
    /// transfers currencies between sub-accounts
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-transfers-initiate-wallet-transfer"/>  <br/>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-transfers-initiate-withdrawal-to-spot-wallet"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : Exchange specific parameters
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>undefined</term> undefined.</returns>
    public async Task<TransferEntry> Transfer(string code, double amount, string fromAccount, string toAccount, Dictionary<string, object> parameters = null)
    {
        var res = await this.transfer(code, amount, fromAccount, toAccount, parameters);
        return new TransferEntry(res);
    }
    /// <summary>
    /// set the level of leverage for a market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-multi-collateral-set-the-leverage-setting-for-a-market"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> response from the exchange.</returns>
    public async Task<Dictionary<string, object>> SetLeverage(Int64 leverage, string symbol = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.setLeverage(leverage, symbol, parameters);
        return ((Dictionary<string, object>)res);
    }
    /// <summary>
    /// fetch the set leverage for all contract and margin markets
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-multi-collateral-get-the-leverage-setting-for-a-market"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a list of [leverage structures]{@link https://docs.ccxt.com/#/?id=leverage-structure}.</returns>
    public async Task<Leverages> FetchLeverages(List<String> symbols = null, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchLeverages(symbols, parameters);
        return new Leverages(res);
    }
    /// <summary>
    /// fetch the set leverage for a market
    /// </summary>
    /// <remarks>
    /// See <see href="https://docs.futures.kraken.com/#http-api-trading-v3-api-multi-collateral-get-the-leverage-setting-for-a-market"/>  <br/>
    /// <list type="table">
    /// <item>
    /// <term>params</term>
    /// <description>
    /// object : extra parameters specific to the exchange API endpoint
    /// </description>
    /// </item>
    /// </list>
    /// </remarks>
    /// <returns> <term>object</term> a [leverage structure]{@link https://docs.ccxt.com/#/?id=leverage-structure}.</returns>
    public async Task<Leverage> FetchLeverage(string symbol, Dictionary<string, object> parameters = null)
    {
        var res = await this.fetchLeverage(symbol, parameters);
        return new Leverage(res);
    }
}
