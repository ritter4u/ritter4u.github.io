___

  

Singleton pattern is one of the simplest design patterns in Java. This type of design pattern comes under creational pattern as this pattern provides one of the best ways to create an object.

This pattern involves a single class which is responsible to create an object while making sure that only single object gets created. This class provides a way to access its only object which can be accessed directly without need to instantiate the object of the class.

## Implementation

We're going to create a _SingleObject_ class. _SingleObject_ class have its constructor as private and have a static instance of itself.

_SingleObject_ class provides a static method to get its static instance to outside world. _SingletonPatternDemo_, our demo class will use _SingleObject_ class to get a _SingleObject_ object.

![Singleton Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/singleton_pattern_uml_diagram.jpg)

## Step 1

Create a Singleton Class.

_SingleObject.java_

```
public class SingleObject {

   //create an object of SingleObject
   private static SingleObject instance = new SingleObject();

   //make the constructor private so that this class cannot be
   //instantiated
   private SingleObject(){}

   //Get the only object available
   public static SingleObject getInstance(){
      return instance;
   }

   public void showMessage(){
      System.out.println("Hello World!");
   }
}
```

## Step 2

Get the only object from the singleton class.

_SingletonPatternDemo.java_

```
public class SingletonPatternDemo {
   public static void main(String[] args) {

      //illegal construct
      //Compile Time Error: The constructor SingleObject() is not visible
      //SingleObject object = new SingleObject();

      //Get the only object available
      SingleObject object = SingleObject.getInstance();

      //show the message
      object.showMessage();
   }
}
```

## Step 3

Verify the output.

```
Hello World!

```