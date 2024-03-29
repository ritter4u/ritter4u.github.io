---
title: "-" # Title of the blog post.
date: 2022-10-01T02:48:57+09:00 # Date of post creation.
description: "Article description." # Description used for search engine.
featured: true # Sets if post is a featured post, making appear on the home page side bar.
draft: true # Sets whether to render this page. Draft of true will not be rendered.
toc: true # Controls if a table of contents should be generated for first-level links automatically.
# menu: main
featureImage: "/images/path/file.jpg" # Sets featured image on blog post.
thumbnail: "/images/path/thumbnail.png" # Sets thumbnail image appearing inside card on homepage.
shareImage: "/images/path/share.png" # Designate a separate image for social media sharing.
codeMaxLines: 10 # Override global value for how many lines within a code block before auto-collapsing.
codeLineNumbers: true # Override global value for showing of line numbers within code block.
figurePositionShow: true # Override global value for showing the figure label.

# comment: false # Disable comment if false.
---

  

The intercepting filter design pattern is used when we want to do some pre-processing / post-processing with request or response of the application. Filters are defined and applied on the request before passing the request to actual target application. Filters can do the authentication/ authorization/ logging or tracking of request and then pass the requests to corresponding handlers. Following are the entities of this type of design pattern.

-   **Filter** - Filter which will performs certain task prior or after execution of request by request handler.
    
-   **Filter Chain** - Filter Chain carries multiple filters and help to execute them in defined order on target.
    
-   **Target** - Target object is the request handler
    
-   **Filter Manager** - Filter Manager manages the filters and Filter Chain.
    
-   **Client** - Client is the object who sends request to the Target object.
    

## Implementation

We are going to create a _FilterChain_,_FilterManager_, _Target_, _Client_ as various objects representing our entities._AuthenticationFilter_ and _DebugFilter_ represent concrete filters.

_InterceptingFilterDemo_, our demo class, will use _Client_ to demonstrate Intercepting Filter Design Pattern.

![Intercepting Filter Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/interceptingfilter_pattern_uml_diagram.jpg)

## Step 1

Create Filter interface.

_Filter.java_

```
public interface Filter {
   public void execute(String request);
}
```

## Step 2

Create concrete filters.

_AuthenticationFilter.java_

```
public class AuthenticationFilter implements Filter {
   public void execute(String request){
      System.out.println("Authenticating request: " + request);
   }
}
```

_DebugFilter.java_

```
public class DebugFilter implements Filter {
   public void execute(String request){
      System.out.println("request log: " + request);
   }
}
```

## Step 3

Create Target

_Target.java_

```
public class Target {
   public void execute(String request){
      System.out.println("Executing request: " + request);
   }
}
```

## Step 4

Create Filter Chain

_FilterChain.java_

```
import java.util.ArrayList;
import java.util.List;

public class FilterChain {
   private List<Filter> filters = new ArrayList<Filter>();
   private Target target;

   public void addFilter(Filter filter){
      filters.add(filter);
   }

   public void execute(String request){
      for (Filter filter : filters) {
         filter.execute(request);
      }
      target.execute(request);
   }

   public void setTarget(Target target){
      this.target = target;
   }
}
```

## Step 5

Create Filter Manager

_FilterManager.java_

```
public class FilterManager {
   FilterChain filterChain;

   public FilterManager(Target target){
      filterChain = new FilterChain();
      filterChain.setTarget(target);
   }
   public void setFilter(Filter filter){
      filterChain.addFilter(filter);
   }

   public void filterRequest(String request){
      filterChain.execute(request);
   }
}
```

## Step 6

Create Client

_Client.java_

```
public class Client {
   FilterManager filterManager;

   public void setFilterManager(FilterManager filterManager){
      this.filterManager = filterManager;
   }

   public void sendRequest(String request){
      filterManager.filterRequest(request);
   }
}
```

## Step 7

Use the _Client_ to demonstrate Intercepting Filter Design Pattern.

_InterceptingFilterDemo.java_

```
public class InterceptingFilterDemo {
   public static void main(String[] args) {
      FilterManager filterManager = new FilterManager(new Target());
      filterManager.setFilter(new AuthenticationFilter());
      filterManager.setFilter(new DebugFilter());

      Client client = new Client();
      client.setFilterManager(filterManager);
      client.sendRequest("HOME");
   }
}
```

## Step 8

Verify the output.

```
Authenticating request: HOME
request log: HOME
Executing request: HOME

```