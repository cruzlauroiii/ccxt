package ccxt

import (
	"crypto/rand"
	"encoding/hex"
	j "encoding/json"
	"errors"
	"fmt"
	random2 "math/rand"
	"net/http"
	"net/url"
	"reflect"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

type Exchange struct {
	MarketsMutex *sync.Mutex
	// cachedCurrenciesMutex  sync.Mutex
	loadMu                 sync.Mutex
	marketsLoading         bool
	marketsLoaded          bool
	loadMarketsSubscribers []chan interface{}
	Itf                    interface{}
	DerivedExchange        IDerivedExchange
	methodCache            sync.Map
	cacheLoaded            bool
	Version                string
	Id                     string
	Name                   string
	Options                *sync.Map
	Has                    map[string]interface{}
	Api                    map[string]interface{}
	TransformedApi         map[string]interface{}
	Markets                *sync.Map
	Markets_by_id          *sync.Map
	Currencies_by_id       *sync.Map
	Currencies             *sync.Map
	RequiredCredentials    map[string]interface{}
	HttpExceptions         map[string]interface{}
	MarketsById            *sync.Map
	Timeframes             map[string]interface{}
	Features               map[string]interface{}
	Exceptions             map[string]interface{}
	Precision              map[string]interface{}
	Urls                   interface{}
	UserAgents             map[string]interface{}
	Timeout                int64
	MAX_VALUE              float64
	RateLimit              float64
	TokenBucket            map[string]interface{}
	Throttler              Throttler
	NewUpdates             bool
	Alias                  bool
	Verbose                bool
	UserAgent              string
	EnableRateLimit        bool
	Url                    string
	Hostname               string
	BaseCurrencies         *sync.Map
	QuoteCurrencies        *sync.Map
	ReloadingMarkets       bool
	MarketsLoading         bool
	Symbols                []string
	Codes                  []string
	Ids                    []string
	CommonCurrencies       map[string]interface{}
	PrecisionMode          int
	Limits                 map[string]interface{}
	Fees                   map[string]interface{}
	CurrenciesById         *sync.Map
	ReduceFees             bool

	AccountsById interface{}
	Accounts     interface{}

	// timestamps
	LastRestRequestTimestamp int64
	LastRequestHeaders       interface{}
	Last_request_headers     interface{}
	Last_http_response       interface{}
	LastRequestBody          interface{}
	Last_request_body        interface{}
	Last_request_url         interface{}
	LastRequestUrl           interface{}
	Headers                  interface{}
	ReturnResponseHeaders    bool

	// type check this
	Number interface{}
	// keys
	Secret        string
	ApiKey        string
	Password      string
	Uid           string
	AccountId     string
	Token         string
	Login         string
	PrivateKey    string
	WalletAddress string

	httpClient *http.Client

	HttpProxy            interface{}
	HttpsProxy           interface{}
	Http_proxy           interface{}
	Https_proxy          interface{}
	Proxy                interface{}
	ProxyUrl             interface{}
	ProxyUrlCallback     interface{}
	Proxy_url            interface{}
	Proxy_url_callback   interface{}
	SocksProxy           interface{}
	Socks_proxy          interface{}
	SocksProxyCallback   interface{}
	Socks_proxy_callback interface{}

	HttpsProxyCallback   interface{}
	Https_proxy_callback interface{}

	HttpProxyCallback   interface{}
	Http_proxy_callback interface{}
	SocksroxyCallback   interface{}

	WsSocksProxy   string
	Ws_socks_proxy string

	WssProxy  string
	Wss_proxy string

	WsProxy  string
	Ws_proxy string

	SubstituteCommonCurrencyCodes bool

	Twofa interface{}

	// WS
	Clients    interface{}
	Ohlcvs     interface{}
	Trades     interface{}
	Tickers    interface{}
	Orders     interface{}
	Positions  interface{}
	MyTrades   interface{}
	Orderbooks interface{}

	PaddingMode int

	MinFundingAddressLength int
	MaxEntriesPerRequest    int

	// tests only
	FetchResponse interface{}

	IsSandboxModeEnabled bool
}

const (
	DECIMAL_PLACES     int = 2
	SIGNIFICANT_DIGITS int = 3
	TICK_SIZE          int = 4
)

const TRUNCATE int = 0

const (
	NO_PADDING        = 5
	PAD_WITH_ZERO int = 6
)

// var ROUND int = 0

func (this *Exchange) InitParent(userConfig map[string]interface{}, exchangeConfig map[string]interface{}, itf interface{}) {
	// this = &Exchange{}
	if this.Options == nil {
		this.Options = &sync.Map{} // by default sync.map is nil
	}
	if this.MarketsMutex == nil {
		this.MarketsMutex = &sync.Mutex{}
	}
	describeValues := this.Describe()
	if userConfig == nil {
		userConfig = map[string]interface{}{}
	}

	extendedProperties := this.DeepExtend(describeValues, exchangeConfig)
	extendedProperties = this.DeepExtend(extendedProperties, userConfig)
	this.Itf = itf
	// this.id = SafeString(extendedProperties, "id", "").(string)
	// this.Id = this.id333
	// this.itf = itf

	// warmup itf cache

	this.initializeProperties(extendedProperties)
	// beforeNs := time.Now().UnixNano()
	// this.WarmUpCache(this.Itf)
	// afterNs := time.Now().UnixNano()
	// fmt.Println("Warmup cache took: ", afterNs-beforeNs)

	this.AfterConstruct()

	this.transformApiNew(this.Api)
	transport := &http.Transport{}

	this.httpClient = &http.Client{
		Timeout:   30 * time.Second,
		Transport: transport,
	}

	if IsTrue(IsTrue(this.SafeBool(userConfig, "sandbox")) || IsTrue(this.SafeBool(userConfig, "testnet"))) {
		this.SetSandboxMode(true)
	}

	// fmt.Println(this.TransformedApi)
}

func (this *Exchange) Init(userConfig map[string]interface{}) {
	if this.Options == nil {
		this.Options = &sync.Map{} // by default sync.map is nil
	}

	if this.MarketsMutex == nil {
		this.MarketsMutex = &sync.Mutex{}
	}
	// to do
}

func NewExchange() ICoreExchange {
	exchange := &Exchange{}
	exchange.Init(map[string]interface{}{})
	return exchange
}

func (this *Exchange) WarmUpCache() {
	// itf fields
	if this.cacheLoaded {
		return
	}
	this.cacheLoaded = true
	itf := this.Itf
	baseValue := reflect.ValueOf(itf)
	baseType := baseValue.Type()

	for i := 0; i < baseType.NumMethod(); i++ {
		method := baseType.Method(i)
		name := method.Name
		cacheKey := fmt.Sprintf("%s", name)

		methodValue := baseValue.MethodByName(name)
		methodType := method.Type
		numIn := methodType.NumIn()
		isVariadic := methodType.IsVariadic()

		cacheValue := map[string]interface{}{
			"method":      method,
			"methodValue": methodValue,
			"methodType":  methodType,
			"numIn":       numIn,
			"isVariadic":  isVariadic,
		}

		this.methodCache.Store(cacheKey, cacheValue)
	}
}

func (this *Exchange) InitThrottler() {
	this.Throttler = NewThrottler(this.TokenBucket)
}

/*
*
  - @method
  - @name Exchange#loadMarkets
  - @description Loads and prepares the markets for trading.
  - @param {boolean} param.reload - If true, the markets will be reloaded from the exchange.
  - @param {object} params - Additional exchange-specific parameters for the request.
  - @throws An error if the markets cannot be loaded or prepared.
*/
func (this *Exchange) LoadMarkets(params ...interface{}) <-chan interface{} {
	reload := GetArg(params, 0, false).(bool)
	this.loadMu.Lock()

	if this.marketsLoaded && !reload {
		out := make(chan interface{}, 1)
		out <- this.Markets
		close(out)
		this.loadMu.Unlock()
		return out
	}

	ch := make(chan interface{}, 1)
	this.loadMarketsSubscribers = append(this.loadMarketsSubscribers, ch)

	if !this.marketsLoading || reload {
		this.marketsLoading = true
		markets := <-this.LoadMarketsHelper(params...)
		this.marketsLoaded = true
		this.marketsLoading = false
		for _, ch := range this.loadMarketsSubscribers {
			ch <- markets
			close(ch)
		}
		this.loadMarketsSubscribers = nil
	}

	this.loadMu.Unlock()
	return ch
}

func (this *Exchange) LoadMarketsHelper(params ...interface{}) <-chan interface{} {
	ch := make(chan interface{})

	go func() {
		defer close(ch)
		defer func() {
			if r := recover(); r != nil {
				ch <- "panic:" + ToString(r)
			}
		}()
		reload := GetArg(params, 0, false).(bool)
		params := GetArg(params, 1, map[string]interface{}{})
		this.WarmUpCache()
		if !reload {
			if this.Markets != nil {
				if this.Markets_by_id == nil {
					// Only lock when writing
					this.MarketsMutex.Lock()
					result := this.SetMarkets(this.Markets, nil)
					this.MarketsMutex.Unlock()
					ch <- result
					return
				}
				ch <- this.Markets
				return
			}
		}

		var currencies interface{} = nil
		hasFetchCurrencies := this.Has["fetchCurrencies"]
		if IsBool(hasFetchCurrencies) && IsTrue(hasFetchCurrencies) {
			currencies = <-this.DerivedExchange.FetchCurrencies(params)
			// this.cachedCurrenciesMutex.Lock()
			// this.Options["cachedCurrencies"] = currencies
			this.Options.Store("cachedCurrencies", currencies)
			// this.cachedCurrenciesMutex.Unlock()
		}

		markets := <-this.DerivedExchange.FetchMarkets(params)
		PanicOnError(markets)

		// this.cachedCurrenciesMutex.Lock()
		// delete(this.Options, "cachedCurrencies")
		// this.Options.Del
		this.Options.Delete("cachedCurrencies")
		// this.cachedCurrenciesMutex.Unlock()

		// Lock only for writing
		this.MarketsMutex.Lock()
		result := this.SetMarkets(markets, currencies)
		this.MarketsMutex.Unlock()

		ch <- result
	}()
	return ch
}

func (this *Exchange) Throttle(cost interface{}) <-chan interface{} {
	// to do
	ch := make(chan interface{})
	go func() {
		defer close(ch)
		task := <-this.Throttler.Throttle(cost)
		ch <- task
	}()
	return ch
}

func (this *Exchange) FetchMarkets(optionalArgs ...interface{}) <-chan interface{} {
	ch := make(chan interface{})
	go func() interface{} {
		// defer close(ch)
		// markets := <-this.callInternal("fetchMarkets", optionalArgs)
		// return markets
		return this.Markets
	}()
	return ch
}

func (this *Exchange) FetchCurrencies(optionalArgs ...interface{}) <-chan interface{} {
	ch := make(chan interface{})
	go func() interface{} {
		defer close(ch)
		// markets := <-this.callInternal("fetchCurrencies", optionalArgs)
		// return markets
		return this.Currencies
	}()
	return ch
}

func (this *Exchange) Sleep(milliseconds interface{}) <-chan bool {
	var duration time.Duration

	// Type assertion to handle various types for milliseconds
	ch := make(chan bool)
	go func() interface{} {
		switch v := milliseconds.(type) {
		case int:
			duration = time.Duration(v) * time.Millisecond
		case float64:
			duration = time.Duration(v * float64(time.Millisecond))
		case time.Duration:
			// If already a time.Duration, use it directly
			duration = v
		default:
			return false
		}

		// Sleep for the specified duration
		time.Sleep(duration)
		return true
	}()
	return ch
}

func Unique(obj interface{}) []string {
	// Type assertion to check if obj is of type []string
	strList, ok := obj.([]string)
	if !ok {
		return nil
	}

	// Use a map to ensure uniqueness
	uniqueMap := make(map[string]struct{})
	var result []string

	for _, str := range strList {
		// Check if the string is already in the map
		if _, exists := uniqueMap[str]; !exists {
			uniqueMap[str] = struct{}{}
			result = append(result, str)
		}
	}

	return result
}

func (this *Exchange) Log(args ...interface{}) {
	// convert to str and print
	fmt.Println(args)
}

func (this *Exchange) callEndpoint(endpoint2 interface{}, parameters interface{}) <-chan interface{} {
	ch := make(chan interface{})

	go func() {
		defer close(ch)

		defer func() {
			if r := recover(); r != nil {
				ch <- "panic:" + ToString(r)
			}
		}()

		endpoint := endpoint2.(string)
		if val, ok := this.TransformedApi[endpoint]; ok {
			endPointData := val.(map[string]interface{})
			// endPointData := this.TransformedApi[endpoint].(map[string]interface{})
			method := endPointData["method"].(string)
			path := endPointData["path"].(string)
			api := endPointData["api"]
			var cost float64 = 1
			if valCost, ok := endPointData["cost"]; ok {
				cost = valCost.(float64)
			}
			res := <-this.Fetch2(path, api, method, parameters, map[string]interface{}{}, nil, map[string]interface{}{"cost": cost})
			PanicOnError(res)
			ch <- res
		} else {
			ch <- nil
		}
	}()
	return ch
}

func (this *Exchange) ConvertToBigInt(data interface{}) interface{} {
	return ParseInt(data)
}

func (this *Exchange) CreateSafeDictionary() *sync.Map {
	// Create a new sync.Map to hold the safe dictionary
	return &sync.Map{}
}

// error related functions

type ErrorType string

type Error struct {
	Type    ErrorType
	Message string
	Stack   string
}

func (e *Error) Error() string {
	return fmt.Sprintf("[ccxtError]::[%s]::[%s]\nStack:\n%s", e.Type, e.Message, e.Stack)
}

func NewError(errType interface{}, message ...interface{}) error {
	typeErr := ToString(errType)
	msg := ""
	stack := ""
	if len(message) > 0 {
		msg = ToString(message[0])
		if len(message) > 1 {
			stack = ToString(message[1])
		}
	}
	return &Error{Type: ErrorType(string(typeErr)), Message: msg, Stack: stack}
}

func Exception(v ...interface{}) error {
	return NewError("Exception", v...)
}

func IsError(res interface{}) bool {
	resStr, ok := res.(string)
	if ok {
		return strings.HasPrefix(resStr, "panic:")
	}
	return false
}

func CreateReturnError(res interface{}) error {
	resStr := res.(string)
	resStr = strings.ReplaceAll(resStr, "panic:", "")
	if strings.Contains(resStr, "ccxtError") {
		// resStr = strings.ReplaceAll(resStr, "ccxtError", "")
		splitted := strings.Split(resStr, "::")
		s1 := splitted[1]
		s2 := splitted[2]
		exceptionName := s1[1 : len(s1)-1]
		message := s2[1 : len(s2)-1]
		return CreateError(exceptionName, message, res)

	}
	return Exception(resStr)
}

// emd of error related functions

func ToSafeFloat(v interface{}) (float64, error) {
	switch v := v.(type) {
	case float64:
		return v, nil
	case float32:
		return float64(v), nil
	case int:
		return float64(v), nil
	case int64:
		return float64(v), nil
	case string:
		return strconv.ParseFloat(v, 64)
	default:
		return 0, errors.New("cannot convert to float")
	}
}

// json converts an object to a JSON string
func (this *Exchange) Json(object interface{}) interface{} {
	jsonBytes, err := j.Marshal(object)
	if err != nil {
		return nil
	}
	return string(jsonBytes)
}

func (this *Exchange) ParseNumber(v interface{}, a ...interface{}) interface{} {
	if (v == nil) || (v == "") {
		// return default value if exists
		if len(a) > 0 {
			return a[0]
		}
		return nil
	}
	f, err := ToSafeFloat(v)
	if err == nil {
		return f
	}
	return nil
}

func (this *Exchange) ValueIsDefined(v interface{}) bool {
	return v != nil
}

// func (this *Exchange) CreateSafeDictionary() interface{} {
// 	return map[string]interface{}{}
// }

func (this *Exchange) ConvertToSafeDictionary(data interface{}) interface{} {
	return data
}

func (this *Exchange) callDynamically(name2 interface{}, args ...interface{}) <-chan interface{} {
	return this.callInternal(name2.(string), args...)
}

// clone creates a deep copy of the input object. It supports arrays, slices, and maps.
func (this *Exchange) Clone(object interface{}) interface{} {
	return this.DeepCopy(reflect.ValueOf(object)).Interface()
}

func (this *Exchange) DeepCopy(value reflect.Value) reflect.Value {
	switch value.Kind() {
	case reflect.Array, reflect.Slice:
		// Create a new slice/array of the same type and length
		copy := reflect.MakeSlice(value.Type(), value.Len(), value.Cap())
		for i := 0; i < value.Len(); i++ {
			copy.Index(i).Set(this.DeepCopy(value.Index(i)))
		}
		return copy
	case reflect.Map:
		// Create a new map of the same type
		copy := reflect.MakeMap(value.Type())
		for _, key := range value.MapKeys() {
			copy.SetMapIndex(key, this.DeepCopy(value.MapIndex(key)))
		}
		return copy
	default:
		// For other types, just return the value
		return reflect.ValueOf(value.Interface())
	}
}

type ArrayCache interface {
	ToArray() []interface{}
}

func (this *Exchange) ArraySlice(array interface{}, first interface{}, second ...interface{}) interface{} {
	firstInt := reflect.ValueOf(first).Convert(reflect.TypeOf(0)).Interface().(int)
	parsedArray := reflect.ValueOf(array)

	if parsedArray.Kind() != reflect.Slice {
		return nil
	}

	length := parsedArray.Len()
	isArrayCache := reflect.TypeOf(array).Implements(reflect.TypeOf((*ArrayCache)(nil)).Elem())

	if len(second) == 0 {
		if firstInt < 0 {
			index := length + firstInt
			if index < 0 {
				index = 0
			}
			if isArrayCache {
				return reflect.ValueOf(array).Interface().(ArrayCache).ToArray()[index:]
			}
			return this.sliceToInterface(parsedArray.Slice(index, length))
		}
		if isArrayCache {
			return reflect.ValueOf(array).Interface().(ArrayCache).ToArray()[firstInt:]
		}
		return this.sliceToInterface(parsedArray.Slice(firstInt, length))
	}

	secondInt := reflect.ValueOf(second[0]).Convert(reflect.TypeOf(0)).Interface().(int)
	if isArrayCache {
		return reflect.ValueOf(array).Interface().(ArrayCache).ToArray()[firstInt:secondInt]
	}
	return this.sliceToInterface(parsedArray.Slice(firstInt, secondInt))
}

func (this *Exchange) sliceToInterface(value reflect.Value) []interface{} {
	length := value.Len()
	result := make([]interface{}, length)
	for i := 0; i < length; i++ {
		result[i] = value.Index(i).Interface()
	}
	return result
}

// Example ArrayCache implementation for testing
type exampleArrayCache struct {
	data []interface{}
}

func (e *exampleArrayCache) ToArray() []interface{} {
	return e.data
}

func (this *Exchange) ParseTimeframe(timeframe interface{}) interface{} {
	str, ok := timeframe.(string)
	if !ok {
		return nil
	}

	if len(str) < 2 {
		return nil
	}

	amount, err := strconv.Atoi(str[:len(str)-1])
	if err != nil {
		return nil
	}

	unit := str[len(str)-1:]
	scale := 0
	switch unit {
	case "y":
		scale = 60 * 60 * 24 * 365
	case "M":
		scale = 60 * 60 * 24 * 30
	case "w":
		scale = 60 * 60 * 24 * 7
	case "d":
		scale = 60 * 60 * 24
	case "h":
		scale = 60 * 60
	case "m":
		scale = 60
	case "s":
		scale = 1
	default:
		return nil
	}

	result := amount * scale
	return result
}

func Totp(secret interface{}) string {
	return ""
}

func (this *Exchange) ParseJson(input interface{}) interface{} {
	return ParseJSON(input)
}

// type Dict map[string]interface{}

func (this *Exchange) transformApiNew(api Dict, paths ...string) {
	if api == nil {
		return
	}

	if paths == nil {
		paths = []string{}
	}

	for key, value := range api {
		if isHttpMethod(key) {
			var endpoints []string
			if dictValue, ok := value.(map[string]interface{}); ok {
				for endpoint := range dictValue {
					endpoints = append(endpoints, endpoint)
				}
			} else {
				if listValue, ok := value.([]interface{}); ok {
					for _, item := range listValue {
						if s, ok := item.(string); ok {
							endpoints = append(endpoints, s)
						}
					}
				}
			}

			for _, endpoint := range endpoints {
				cost := 1.0
				if dictValue, ok := value.(map[string]interface{}); ok {
					if config, ok := dictValue[endpoint]; ok {
						if dictConfig, ok := config.(map[string]interface{}); ok {
							if rl, success := dictConfig["cost"]; success {
								if rlFloat, ok := rl.(float64); ok {
									cost = rlFloat
								} else if rlString, ok := rl.(string); ok {
									cost = parseCost(rlString)
								}
							}
						} else if config != nil {
							cost = parseCost(fmt.Sprintf("%v", config))
						}
					}
				}

				pattern := `[^a-zA-Z0-9]`
				rgx := regexp.MustCompile(pattern)
				result := rgx.Split(endpoint, -1)

				pathParts := append(paths, key)
				for _, part := range result {
					if len(part) > 0 {
						pathParts = append(pathParts, part)
					}
				}

				for i, part := range pathParts {
					pathParts[i] = strings.Title(part)
				}
				path := strings.Join(pathParts, "")
				if len(path) > 0 {
					path = strings.ToLower(string(path[0])) + path[1:]
				}

				apiObj := interface{}(paths)
				if len(paths) == 1 {
					apiObj = paths[0]
				}

				this.TransformedApi[path] = map[string]interface{}{
					"method": strings.ToUpper(key),
					"path":   endpoint,
					"api":    apiObj,
					"cost":   cost,
				}
			}
		} else {
			if nestedDict, ok := value.(map[string]interface{}); ok {
				this.transformApiNew(nestedDict, append(paths, key)...)
			}
		}
	}
}

func isHttpMethod(key string) bool {
	// Add your implementation of HTTP method check
	httpMethods := []string{"GET", "POST", "PUT", "DELETE", "PATCH"}
	for _, method := range httpMethods {
		if strings.EqualFold(method, key) {
			return true
		}
	}
	return false
}

func parseCost(costStr string) float64 {
	// Add your implementation for parsing cost
	var cost float64
	fmt.Sscanf(costStr, "%f", &cost)
	return cost
}

// func (this *Exchange) callInternal(name2 string, args ...interface{}) interface{} {
// 	name := strings.Title(strings.ToLower(name2))
// 	baseType := reflect.TypeOf(this.Itf)

// 	for i := 0; i < baseType.NumMethod(); i++ {
// 		method := baseType.Method(i)
// 		if name == method.Name {
// 			methodType := method.Type
// 			numIn := methodType.NumIn()
// 			isVariadic := methodType.IsVariadic()

// 			in := make([]reflect.Value, numIn)
// 			argCount := len(args)

// 			for k := 0; k < numIn; k++ {
// 				if k < argCount {
// 					param := args[k]
// 					if param == nil {
// 						// Get the type of the k-th parameter
// 						paramType := methodType.In(k)
// 						// Create a zero value of the parameter type (which will be `nil` for pointers, slices, maps, etc.)
// 						in[k] = reflect.Zero(paramType)
// 					} else {
// 						in[k] = reflect.ValueOf(param)
// 					}
// 				} else {
// 					paramType := methodType.In(k)
// 					in[k] = reflect.Zero(paramType)
// 				}
// 			}

// 			if isVariadic && argCount >= numIn-1 {
// 				variadicArgs := make([]reflect.Value, argCount-(numIn-1))
// 				for k := numIn - 1; k < argCount; k++ {
// 					param := args[k]
// 					if param == nil {
// 						paramType := methodType.In(numIn - 1).Elem()
// 						variadicArgs[k-(numIn-1)] = reflect.Zero(paramType)
// 					} else {
// 						variadicArgs[k-(numIn-1)] = reflect.ValueOf(param)
// 					}
// 				}
// 				in[numIn-1] = reflect.ValueOf(variadicArgs)
// 			}

// 			res := reflect.ValueOf(this.Itf).MethodByName(name).Call(in)
// 			return res[0].Interface()
// 		}
// 	}
// 	return nil
// }

func (this *Exchange) CheckRequiredDependencies() {
	// to do
}

func (this *Exchange) FixStringifiedJsonMembers(a interface{}) string {
	aStr := a.(string)
	aStr = strings.ReplaceAll(aStr, "\\", "")
	aStr = strings.ReplaceAll(aStr, "\"{", "{")
	aStr = strings.ReplaceAll(aStr, "}\"", "}")
	return aStr
}

func (this *Exchange) IsEmpty(a interface{}) bool {
	if a == nil {
		return true
	}

	v := reflect.ValueOf(a)

	switch v.Kind() {
	case reflect.String:
		return v.Len() == 0
	case reflect.Slice, reflect.Array:
		return v.Len() == 0
	case reflect.Map:
		return v.Len() == 0
	default:
		return false
	}
}

func (this *Exchange) CallInternal(name2 string, args ...interface{}) <-chan interface{} {
	return this.callInternal(name2, args...)
}

func (this *Exchange) callInternal(name2 string, args ...interface{}) <-chan interface{} {
	ch := make(chan interface{})
	go func() {
		defer close(ch)
		defer func() {
			if r := recover(); r != nil {
				if r != "break" {
					ch <- "panic:" + ToString(r)
				}
			}
		}()

		this.WarmUpCache()

		res := <-CallInternalMethod(&this.methodCache, this.Itf, name2, args...)
		ch <- res
	}()
	// res := <-CallInternalMethod(this.Itf, name2, args...)
	// return res
	return ch
}

func (this *Exchange) BinaryLength(binary interface{}) int {
	return this.binaryLength(binary)
}

func (this *Exchange) binaryLength(binary interface{}) int {
	var length int

	// Handle different types for the length parameter
	switch v := binary.(type) {
	case []byte:
		length = len(v)
	case string:
		length = len(v)
	default:
		panic(fmt.Sprintf("unsupported binary: %v", reflect.TypeOf(binary)))
	}

	return length
}

func (this *Exchange) RandomBytes(length interface{}) string {
	var byteLength int

	// Handle different types for the length parameter
	switch v := length.(type) {
	case int:
		byteLength = v
	case int32:
		byteLength = int(v)
	case int64:
		byteLength = int(v)
	case float32:
		byteLength = int(v)
	case float64:
		byteLength = int(v)
	default:
		panic(fmt.Sprintf("unsupported length type: %v", reflect.TypeOf(length)))
	}

	if byteLength <= 0 {
		panic("length must be greater than 0")
	}

	x := make([]byte, byteLength)
	_, err := rand.Read(x)
	if err != nil {
		panic(fmt.Sprintf("failed to generate random bytes: %v", err))
	}

	return hex.EncodeToString(x)
}

func (this *Exchange) IsJsonEncodedObject(str interface{}) bool {
	// Attempt to assert the input to a string type
	str2, ok := str.(string)
	if !ok {
		return false
	}

	// Check if the string starts with "{" or "["
	if strings.HasPrefix(str2, "{") || strings.HasPrefix(str2, "[") {
		return true
	}
	return false
}

func (this *Exchange) StringToCharsArray(value interface{}) []string {
	// Attempt to assert the input to a string type
	str, ok := value.(string)
	if !ok {
		panic(fmt.Sprintf("unsupported type: %v, expected string", reflect.TypeOf(value)))
	}

	// Initialize a slice to hold the characters
	chars := make([]string, len(str))

	// Loop through each character in the string and add it to the slice
	for i, char := range str {
		chars[i] = string(char)
	}

	return chars
}

func (this *Exchange) GetMarket(symbol string) MarketInterface {
	// market := this.Markets[symbol]
	market, ok := this.Markets.Load(symbol)
	if !ok {
		return NewMarketInterface(nil)
	}
	return NewMarketInterface(market)
}

func (this *Exchange) GetMarketsList() []MarketInterface {
	var markets []MarketInterface
	// for _, market := range this.Markets {
	// 	markets = append(markets, NewMarketInterface(market))
	// }
	this.Markets.Range(func(key, value interface{}) bool {
		markets = append(markets, NewMarketInterface(value))
		return true

	})
	return markets
}

func (this *Exchange) GetCurrency(currencyId string) Currency {
	// market := this.Currencies[currency]
	currency, ok := this.Currencies.Load(currencyId)
	if !ok {
		return NewCurrency(nil)
	}
	return NewCurrency(currency)
}

func (this *Exchange) GetCurrenciesList() []Currency {
	var currencies []Currency
	// for _, currency := range this.Currencies {
	// 	currencies = append(currencies, NewCurrency(currency))
	// }
	// }
	this.Currencies.Range(func(key, value interface{}) bool {
		currencies = append(currencies, NewCurrency(value))
		return true
	})
	return currencies
}

func (this *Exchange) SetProperty(obj interface{}, property interface{}, defaultValue interface{}) {
	// Convert property to string
	propName, ok := property.(string)
	if !ok {
		// fmt.Println("Property should be a string")
		return
	}

	// Get the reflection object for the obj
	val := reflect.ValueOf(obj).Elem()

	// Get the field by name
	field := val.FieldByName(propName)

	// Check if the field exists and is settable
	if field.IsValid() && field.CanSet() {
		// Set the field with the default value, casting it to the right type
		field.Set(reflect.ValueOf(defaultValue))
	} else {
		// fmt.Printf("Field '%s' is either invalid or cannot be set\n", propName)
	}
}

func (this *Exchange) GetProperty(obj interface{}, property interface{}) interface{} {
	// Convert property to string
	propName, ok := property.(string)
	if !ok {
		// fmt.Println("Property should be a string")
		return nil
	}

	// Get the reflection object for the obj
	val := reflect.ValueOf(obj).Elem()

	// Get the field by name
	field := val.FieldByName(propName)

	// Check if the field exists and can be accessed
	if field.IsValid() && field.CanInterface() {
		// Return the field value as an interface{}
		return field.Interface()
	} else {
		// fmt.Printf("Field '%s' is either invalid or cannot be accessed\n", propName)
		return nil
	}
}

func (this *Exchange) Unique(obj interface{}) []string {
	// Type assertion to check if obj is a slice of strings
	if list, ok := obj.([]string); ok {
		// Create a map to track unique strings
		uniqueMap := make(map[string]bool)
		var uniqueList []string

		// Iterate over the list and add only unique elements
		for _, item := range list {
			if !uniqueMap[item] {
				uniqueMap[item] = true
				uniqueList = append(uniqueList, item)
			}
		}

		return uniqueList
	}

	// If obj is not a []string, return an empty slice
	return []string{}
}

// func (this *Exchange) callInternal(name2 string, args ...interface{}) interface{} {
// 	name := strings.Title(strings.ToLower(name2))
// 	baseType := reflect.TypeOf(this.Itf)

// 	// baseValue := reflect.ValueOf(this.Itf)
// 	// method3 := baseValue.MethodByName(name)
// 	// fmt.Println(method3.Interface())
// 	// method2, err := baseType.MethodByName(name)

// 	// if !err {
// 	// 	fmt.Println((method2))
// 	// }

// 	for i := 0; i < baseType.NumMethod(); i++ {
// 		method := baseType.Method(i)
// 		if name == method.Name {
// 			// methodType := method.Type
// 			in := make([]reflect.Value, len(args))
// 			for k, param := range args {
// 				val := reflect.ValueOf(param)
// 				if !val.IsValid() {
// 					//fmt.Println(val)
// 					//panic("value is invalid")
// 					// paramType := val.Type()
// 					// in[k] = reflect.Zero(paramType)
// 					val = reflect.Zero(nil)
// 				}
// 				in[k] = val
// 			}
// 			var res []reflect.Value
// 			/*temp := reflect.ValueOf(this.Itf).MethodByName(name)
// 			x1 := reflect.ValueOf(temp).FieldByName("flag").Uint()*/
// 			res = reflect.ValueOf(this.Itf).MethodByName(name).Call(in)
// 			return res[0].Interface().(interface{})
// 		}
// 	}
// 	return nil
// }

func (this *Exchange) RetrieveStarkAccount(sig interface{}, account interface{}, hash interface{}) interface{} {
	return nil // to do
}

func (this *Exchange) StarknetEncodeStructuredData(a interface{}, b interface{}, c interface{}, d interface{}) interface{} {
	return nil // to do
}

func (this *Exchange) StarknetSign(a interface{}, b interface{}) interface{} {
	return nil // to do
}

func (this *Exchange) GetZKContractSignatureObj(seed interface{}, params interface{}) <-chan interface{} {
	ch := make(chan interface{})

	go func() {
		defer close(ch)
		defer func() {
			if r := recover(); r != nil {
				ch <- "panic:" + ToString(r)
			}
		}()

		ch <- "panic:" + "Apex currently does not support create order in Go language"
	}()
	return ch
}

func (this *Exchange) GetZKTransferSignatureObj(seed interface{}, params interface{}) <-chan interface{} {
	ch := make(chan interface{})

	go func() {
		defer close(ch)
		defer func() {
			if r := recover(); r != nil {
				ch <- "panic:" + ToString(r)
			}
		}()

		ch <- "panic:" + "Apex currently does not support transfer asset in Go language"
	}()
	return ch
}

func (this *Exchange) ExtendExchangeOptions(options2 interface{}) {
	options := options2.(map[string]interface{})
	extended := this.Extend(this.SafeMapToMap(this.Options), options)
	this.Options = this.MapToSafeMap(extended)
}

// func (this *Exchange) Init(userConfig map[string]interface{}) {
// }

func (this *Exchange) RandNumber(size interface{}) int64 {
	// Try casting interface{} to int
	intSize, ok := size.(int)
	if !ok {
		fmt.Println("Invalid size type; expected int")
		return 0
	}

	random2.Seed(time.Now().UnixNano())
	number := ""

	for i := 0; i < intSize; i++ {
		digit := random2.Intn(10) // Random digit 0-9
		number += strconv.Itoa(digit)
	}

	result, err := strconv.ParseInt(number, 10, 64)
	if err != nil {
		fmt.Println("Error converting string to int64:", err)
		return 0
	}

	return result
}

func (this *Exchange) UpdateProxySettings() {
	proxyUrl := this.CheckProxyUrlSettings(nil, nil, nil, nil)
	proxies := this.CheckProxySettings(nil, "", nil, nil)
	httProxy := this.SafeString(proxies, 0)
	httpsProxy := this.SafeString(proxies, 1)
	socksProxy := this.SafeString(proxies, 2)

	hasHttProxyDefined := (httProxy != nil) || (httpsProxy != nil) || (socksProxy != nil)
	this.CheckConflictingProxies(hasHttProxyDefined, proxyUrl)

	if hasHttProxyDefined {
		proxyTransport := &http.Transport{
			// MaxIdleConns:       100,
			// IdleConnTimeout:    90 * time.Second,
			// DisableCompression: false,
			// DisableKeepAlives:  false,
		}

		proxyUrlStr := ""
		if httProxy != nil {
			proxyUrlStr = httProxy.(string)
		} else {
			proxyUrlStr = httpsProxy.(string)
		}
		proxyURLParsed, _ := url.Parse(proxyUrlStr)
		proxyTransport.Proxy = http.ProxyURL(proxyURLParsed)

		this.httpClient.Transport = proxyTransport
	}
}

func (this *Exchange) callEndpointAsync(endpointName string, args ...interface{}) <-chan interface{} {
	parameters := GetArg(args, 0, nil)
	ch := make(chan interface{})
	go func() {
		defer close(ch)
		defer func() {
			if r := recover(); r != nil {
				ch <- "panic:" + ToString(r)
			}
		}()
		ch <- (<-this.callEndpoint(endpointName, parameters))
		PanicOnError(ch)
	}()
	return ch
}
