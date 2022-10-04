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

  

Business Delegate Pattern is used to decouple presentation tier and business tier. It is basically use to reduce communication or remote lookup functionality to business tier code in presentation tier code. In business tier we have following entities.

-   **Client** - Presentation tier code may be JSP, servlet or UI java code.
    
-   **Business Delegate** - A single entry point class for client entities to provide access to Business Service methods.
    
-   **LookUp Service** - Lookup service object is responsible to get relative business implementation and provide business object access to business delegate object.
    
-   **Business Service** - Business Service interface. Concrete classes implement this business service to provide actual business implementation logic.
    

## Implementation

We are going to create a _Client_, _BusinessDelegate_, _BusinessService_, _LookUpService_, _JMSService_ and _EJBService_ representing various entities of Business Delegate patterns.

_BusinessDelegatePatternDemo_, our demo class, will use _BusinessDelegate_ and _Client_ to demonstrate use of Business Delegate pattern.

![Business Delegate Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/business_delegate_pattern_uml_diagram.jpg)

## Step 1

Create BusinessService Interface.

_BusinessService.java_

```
public interface BusinessService {
   public void doProcessing();
}
```

## Step 2

Create concrete Service classes.

_EJBService.java_

```
public class EJBService implements BusinessService {

   @Override
   public void doProcessing() {
      System.out.println("Processing task by invoking EJB Service");
   }
}
```

_JMSService.java_

```
public class JMSService implements BusinessService {

   @Override
   public void doProcessing() {
      System.out.println("Processing task by invoking JMS Service");
   }
}
```

## Step 3

Create Business Lookup Service.

_BusinessLookUp.java_

```
public class BusinessLookUp {
   public BusinessService getBusinessService(String serviceType){
   
      if(serviceType.equalsIgnoreCase("EJB")){
         return new EJBService();
      }
      else {
         return new JMSService();
      }
   }
}
```

## Step 4

Create Business Delegate.

_BusinessDelegate.java_

```
public class BusinessDelegate {
   private BusinessLookUp lookupService = new BusinessLookUp();
   private BusinessService businessService;
   private String serviceType;

   public void setServiceType(String serviceType){
      this.serviceType = serviceType;
   }

   public void doTask(){
      businessService = lookupService.getBusinessService(serviceType);
      businessService.doProcessing();
   }
}
```

## Step 5

Create Client.

_Client.java_

```
public class Client {

   BusinessDelegate businessService;

   public Client(BusinessDelegate businessService){
      this.businessService  = businessService;
   }

   public void doTask(){
      businessService.doTask();
   }
}
```

## Step 6

Use BusinessDelegate and Client classes to demonstrate Business Delegate pattern.

_BusinessDelegatePatternDemo.java_

```
public class BusinessDelegatePatternDemo {

   public static void main(String[] args) {

      BusinessDelegate businessDelegate = new BusinessDelegate();
      businessDelegate.setServiceType("EJB");

      Client client = new Client(businessDelegate);
      client.doTask();

      businessDelegate.setServiceType("JMS");
      client.doTask();
   }
}
```

## Step 7

Verify the output.

```
Processing task by invoking EJB Service
Processing task by invoking JMS Service

```