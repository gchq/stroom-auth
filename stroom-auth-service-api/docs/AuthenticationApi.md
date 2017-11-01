# AuthenticationApi

All URIs are relative to *http://localhost:8080/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getIdTokenWithGet**](AuthenticationApi.md#getIdTokenWithGet) | **GET** /authentication/v1/idToken | Convert a previously provided access code into an ID token
[**getIdTokenWithPost**](AuthenticationApi.md#getIdTokenWithPost) | **POST** /authentication/v1/idToken | Convert a previously provided access code into an ID token
[**handleAuthenticationRequest**](AuthenticationApi.md#handleAuthenticationRequest) | **GET** /authentication/v1/authenticate | Submit an OpenId AuthenticationRequest.
[**handleLogin**](AuthenticationApi.md#handleLogin) | **POST** /authentication/v1/authenticate | Handle a login request made using username and password credentials.
[**resetEmail**](AuthenticationApi.md#resetEmail) | **GET** /authentication/v1/reset/{email} | Reset a user account using an email address.
[**verifyToken**](AuthenticationApi.md#verifyToken) | **GET** /authentication/v1/verify/{token} | Verify the authenticity and current-ness of a JWS token.
[**welcome**](AuthenticationApi.md#welcome) | **GET** /authentication/v1 | A welcome message.


<a name="getIdTokenWithGet"></a>
# **getIdTokenWithGet**
> String getIdTokenWithGet(accessCode, clientId)

Convert a previously provided access code into an ID token



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
String accessCode = "accessCode_example"; // String | 
String clientId = "clientId_example"; // String | 
try {
    String result = apiInstance.getIdTokenWithGet(accessCode, clientId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#getIdTokenWithGet");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **accessCode** | **String**|  |
 **clientId** | **String**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getIdTokenWithPost"></a>
# **getIdTokenWithPost**
> String getIdTokenWithPost(body)

Convert a previously provided access code into an ID token



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
IdTokenRequest body = new IdTokenRequest(); // IdTokenRequest | idTokenRequest
try {
    String result = apiInstance.getIdTokenWithPost(body);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#getIdTokenWithPost");
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

<a name="handleAuthenticationRequest"></a>
# **handleAuthenticationRequest**
> String handleAuthenticationRequest(clientId, redirectUrl, nonce, scope, responseType, state, sessionId)

Submit an OpenId AuthenticationRequest.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
String clientId = "clientId_example"; // String | 
String redirectUrl = "redirectUrl_example"; // String | 
String nonce = "nonce_example"; // String | 
String scope = "scope_example"; // String | 
String responseType = "responseType_example"; // String | 
String state = "state_example"; // String | 
String sessionId = "sessionId_example"; // String | 
try {
    String result = apiInstance.handleAuthenticationRequest(clientId, redirectUrl, nonce, scope, responseType, state, sessionId);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#handleAuthenticationRequest");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **clientId** | **String**|  |
 **redirectUrl** | **String**|  |
 **nonce** | **String**|  |
 **scope** | **String**|  | [optional]
 **responseType** | **String**|  | [optional]
 **state** | **String**|  | [optional]
 **sessionId** | **String**|  | [optional]

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="handleLogin"></a>
# **handleLogin**
> String handleLogin(body)

Handle a login request made using username and password credentials.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
Credentials body = new Credentials(); // Credentials | Credentials
try {
    String result = apiInstance.handleLogin(body);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#handleLogin");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | [**Credentials**](Credentials.md)| Credentials | [optional]

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="resetEmail"></a>
# **resetEmail**
> String resetEmail(email)

Reset a user account using an email address.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
String email = "email_example"; // String | 
try {
    String result = apiInstance.resetEmail(email);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#resetEmail");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **email** | **String**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="verifyToken"></a>
# **verifyToken**
> String verifyToken(token)

Verify the authenticity and current-ness of a JWS token.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
String token = "token_example"; // String | 
try {
    String result = apiInstance.verifyToken(token);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#verifyToken");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **token** | **String**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="welcome"></a>
# **welcome**
> String welcome()

A welcome message.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.AuthenticationApi;


AuthenticationApi apiInstance = new AuthenticationApi();
try {
    String result = apiInstance.welcome();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling AuthenticationApi#welcome");
    e.printStackTrace();
}
```

### Parameters
This endpoint does not need any parameter.

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

