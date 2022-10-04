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

  

The front controller design pattern is used to provide a centralized request handling mechanism so that all requests will be handled by a single handler. This handler can do the authentication/ authorization/ logging or tracking of request and then pass the requests to corresponding handlers. Following are the entities of this type of design pattern.

-   **Front Controller** - Single handler for all kinds of requests coming to the application (either web based/ desktop based).
    
-   **Dispatcher** - Front Controller may use a dispatcher object which can dispatch the request to corresponding specific handler.
    
-   **View** - Views are the object for which the requests are made.
    

## Implementation

We are going to create a _FrontController_ and _Dispatcher_ to act as Front Controller and Dispatcher correspondingly. _HomeView_ and _StudentView_ represent various views for which requests can come to front controller.

_FrontControllerPatternDemo_, our demo class, will use _FrontController_ to demonstrate Front Controller Design Pattern.

![Front Controller Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/frontcontroller_pattern_uml_diagram.jpg)

## Step 1

Create Views.

_HomeView.java_

```
public class HomeView {
   public void show(){
      System.out.println("Displaying Home Page");
   }
}
```

_StudentView.java_

```
public class StudentView {
   public void show(){
      System.out.println("Displaying Student Page");
   }
}
```

## Step 2

Create Dispatcher.

_Dispatcher.java_

```
public class Dispatcher {
   private StudentView studentView;
   private HomeView homeView;
   
   public Dispatcher(){
      studentView = new StudentView();
      homeView = new HomeView();
   }

   public void dispatch(String request){
      if(request.equalsIgnoreCase("STUDENT")){
         studentView.show();
      }
      else{
         homeView.show();
      }
   }
}
```

## Step 3

Create FrontController

_FrontController.java_

```
public class FrontController {

   private Dispatcher dispatcher;

   public FrontController(){
      dispatcher = new Dispatcher();
   }

   private boolean isAuthenticUser(){
      System.out.println("User is authenticated successfully.");
      return true;
   }

   private void trackRequest(String request){
      System.out.println("Page requested: " + request);
   }

   public void dispatchRequest(String request){
      //log each request
      trackRequest(request);
      
      //authenticate the user
      if(isAuthenticUser()){
         dispatcher.dispatch(request);
      }
   }
}
```

## Step 4

Use the _FrontController_ to demonstrate Front Controller Design Pattern.

_FrontControllerPatternDemo.java_

```
public class FrontControllerPatternDemo {
   public static void main(String[] args) {
   
      FrontController frontController = new FrontController();
      frontController.dispatchRequest("HOME");
      frontController.dispatchRequest("STUDENT");
   }
}
```

## Step 5

Verify the output.

```
Page requested: HOME
User is authenticated successfully.
Displaying Home Page
Page requested: STUDENT
User is authenticated successfully.
Displaying Student Page

```