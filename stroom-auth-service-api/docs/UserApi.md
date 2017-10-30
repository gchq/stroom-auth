# UserApi

All URIs are relative to *http://localhost:8080/*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createUser**](UserApi.md#createUser) | **POST** /user/v1 | Create a user.
[**deleteUser**](UserApi.md#deleteUser) | **DELETE** /user/v1/{id} | Delete a user by ID.
[**getAll**](UserApi.md#getAll) | **GET** /user/v1 | Get all users.
[**getUser**](UserApi.md#getUser) | **GET** /user/v1/{id} | Get a user by ID.
[**readCurrentUser**](UserApi.md#readCurrentUser) | **GET** /user/v1/me | Get the details of the currently logged-in user.
[**updateUser**](UserApi.md#updateUser) | **PUT** /user/v1/{id} | Update a user.


<a name="createUser"></a>
# **createUser**
> String createUser()

Create a user.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
try {
    String result = apiInstance.createUser();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#createUser");
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

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="deleteUser"></a>
# **deleteUser**
> String deleteUser(id)

Delete a user by ID.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
Integer id = 56; // Integer | 
try {
    String result = apiInstance.deleteUser(id);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#deleteUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Integer**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getAll"></a>
# **getAll**
> String getAll()

Get all users.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
try {
    String result = apiInstance.getAll();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#getAll");
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

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="getUser"></a>
# **getUser**
> String getUser(id)

Get a user by ID.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
Integer id = 56; // Integer | 
try {
    String result = apiInstance.getUser(id);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#getUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Integer**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="readCurrentUser"></a>
# **readCurrentUser**
> String readCurrentUser()

Get the details of the currently logged-in user.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
try {
    String result = apiInstance.readCurrentUser();
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#readCurrentUser");
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

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="updateUser"></a>
# **updateUser**
> String updateUser(id)

Update a user.



### Example
```java
// Import classes:
//import stroom.auth.service.ApiException;
//import stroom.auth.service.api.UserApi;


UserApi apiInstance = new UserApi();
Integer id = 56; // Integer | 
try {
    String result = apiInstance.updateUser(id);
    System.out.println(result);
} catch (ApiException e) {
    System.err.println("Exception when calling UserApi#updateUser");
    e.printStackTrace();
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **Integer**|  |

### Return type

**String**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

