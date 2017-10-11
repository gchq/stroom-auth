# DefaultApi

All URIs are relative to *http://localhost:8080/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create**](DefaultApi.md#create) | **POST** /token/v1 | Submit a search request for tokens
[**getIdToken**](DefaultApi.md#getIdToken) | **POST** /authentication/v1/idToken | Convert a previously provided access code into an ID token
[**search**](DefaultApi.md#search) | **POST** /token/v1/search | Submit a search request for tokens


<a name="create"></a>
# **create**
> String create(body)

Submit a search request for tokens



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
CreateTokenRequest body = new CreateTokenRequest(); // CreateTokenRequest | CreateTokenRequest
try {
    String result = apiInstance.create(body);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#create");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**CreateTokenRequest**](CreateTokenRequest.md)| CreateTokenRequest | [optional]

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getIdToken"></a>
# **getIdToken**
> String getIdToken(body)

Convert a previously provided access code into an ID token



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
IdTokenRequest body = new IdTokenRequest(); // IdTokenRequest | idTokenRequest
try {
    String result = apiInstance.getIdToken(body);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#getIdToken");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**IdTokenRequest**](IdTokenRequest.md)| idTokenRequest | [optional]

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="search"></a>
# **search**
> SearchResponse search(body)

Submit a search request for tokens



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.DefaultApi;


DefaultApi apiInstance = new DefaultApi();
SearchRequest body = new SearchRequest(); // SearchRequest | SearchRequest
try {
    SearchResponse result = apiInstance.search(body);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling DefaultApi#search");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**SearchRequest**](SearchRequest.md)| SearchRequest | [optional]

### Return type

[**SearchResponse**](SearchResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

