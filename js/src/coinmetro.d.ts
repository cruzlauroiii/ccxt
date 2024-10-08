import Exchange from './abstract/coinmetro.js';
import { Balances, Currencies, Currency, Dict, IndexType, int, Int, Market, Num, OHLCV, Order, OrderBook, OrderSide, OrderType, Str, Strings, Ticker, Tickers, Trade, LedgerEntry } from './base/types.js';
/**
 * @class coinmetro
 * @augments Exchange
 */
export default class coinmetro extends Exchange {
    describe(): any;
    fetchCurrencies(params?: {}): Promise<Currencies>;
    fetchMarkets(params?: {}): Promise<Market[]>;
    parseMarket(market: Dict): Market;
    parseMarketId(marketId: any): Dict;
    parseMarketPrecisionAndLimits(currencyId: any): Dict;
    fetchOHLCV(symbol: string, timeframe?: string, since?: Int, limit?: Int, params?: {}): Promise<OHLCV[]>;
    parseOHLCV(ohlcv: any, market?: Market): OHLCV;
    fetchTrades(symbol: string, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    fetchMyTrades(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Trade[]>;
    parseTrade(trade: Dict, market?: Market): Trade;
    fetchOrderBook(symbol: string, limit?: Int, params?: {}): Promise<OrderBook>;
    parseBidsAsks(bidasks: any, priceKey?: IndexType, amountKey?: IndexType, countOrIdKey?: IndexType): any[];
    fetchTickers(symbols?: Strings, params?: {}): Promise<Tickers>;
    fetchBidsAsks(symbols?: Strings, params?: {}): Promise<Tickers>;
    parseTicker(ticker: Dict, market?: Market): Ticker;
    fetchBalance(params?: {}): Promise<Balances>;
    parseBalance(balances: any): Balances;
    fetchLedger(code?: Str, since?: Int, limit?: Int, params?: {}): Promise<LedgerEntry[]>;
    parseLedgerEntry(item: Dict, currency?: Currency): LedgerEntry;
    parseLedgerEntryDescription(description: any): any[];
    parseLedgerEntryType(type: any): string;
    createOrder(symbol: string, type: OrderType, side: OrderSide, amount: number, price?: Num, params?: {}): Promise<Order>;
    handleCreateOrderSide(sellingCurrency: any, buyingCurrency: any, sellingQty: any, buyingQty: any, request?: {}): {};
    encodeOrderTimeInForce(timeInForce: any): any;
    cancelOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    closePosition(symbol: string, side?: OrderSide, params?: {}): Promise<Order>;
    fetchOpenOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchCanceledAndClosedOrders(symbol?: Str, since?: Int, limit?: Int, params?: {}): Promise<Order[]>;
    fetchOrder(id: string, symbol?: Str, params?: {}): Promise<Order>;
    parseOrder(order: Dict, market?: Market): Order;
    parseOrderTimeInForce(timeInForce: any): any;
    borrowCrossMargin(code: string, amount: number, params?: {}): Promise<any>;
    parseMarginLoan(info: any, currency?: Currency): {
        id: any;
        currency: string;
        amount: any;
        symbol: any;
        timestamp: any;
        datetime: any;
        info: any;
    };
    sign(path: any, api?: string, method?: string, params?: {}, headers?: any, body?: any): {
        url: string;
        method: string;
        body: any;
        headers: any;
    };
    handleErrors(code: int, reason: string, url: string, method: string, headers: Dict, body: string, response: any, requestHeaders: any, requestBody: any): any;
}
