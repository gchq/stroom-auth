# SessionApi

All URIs are relative to *http://localhost:8080/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**logout**](SessionApi.md#logout) | **GET** /session/v1/logout | Log a user out of their session


<a name="logout"></a>
# **logout**
> logout()

Log a user out of their session



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.SessionApi;


SessionApi apiInstance = new SessionApi();
try {
    apiInstance.logout();
} catch (ApiException e) {
    System.err.println("Exception when calling SessionApi#logout");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

