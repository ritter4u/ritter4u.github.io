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

  

Command pattern is a data driven design pattern and falls under behavioral pattern category. A request is wrapped under an object as command and passed to invoker object. Invoker object looks for the appropriate object which can handle this command and passes the command to the corresponding object which executes the command.

## Implementation

We have created an interface _Order_ which is acting as a command. We have created a _Stock_ class which acts as a request. We have concrete command classes _BuyStock_ and _SellStock_ implementing _Order_ interface which will do actual command processing. A class _Broker_ is created which acts as an invoker object. It can take and place orders.

_Broker_ object uses command pattern to identify which object will execute which command based on the type of command. _CommandPatternDemo_, our demo class, will use _Broker_ class to demonstrate command pattern.

![Command Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/command_pattern_uml_diagram.jpg)

## Step 1

Create a command interface.

_Order.java_

```
public interface Order {
   void execute();
}
```

## Step 2

Create a request class.

_Stock.java_

```
public class Stock {

   private String name = "ABC";
   private int quantity = 10;

   public void buy(){
      System.out.println("Stock [ Name: "+name+", 
         Quantity: " + quantity +" ] bought");
   }
   public void sell(){
      System.out.println("Stock [ Name: "+name+", 
         Quantity: " + quantity +" ] sold");
   }
}
```

## Step 3

Create concrete classes implementing the _Order_ interface.

_BuyStock.java_

```
public class BuyStock implements Order {
   private Stock abcStock;

   public BuyStock(Stock abcStock){
      this.abcStock = abcStock;
   }

   public void execute() {
      abcStock.buy();
   }
}
```

_SellStock.java_

```
public class SellStock implements Order {
   private Stock abcStock;

   public SellStock(Stock abcStock){
      this.abcStock = abcStock;
   }

   public void execute() {
      abcStock.sell();
   }
}
```

## Step 4

Create command invoker class.

_Broker.java_

```
import java.util.ArrayList;
import java.util.List;

   public class Broker {
   private List<Order> orderList = new ArrayList<Order>(); 

   public void takeOrder(Order order){
      orderList.add(order);
   }

   public void placeOrders(){
   
      for (Order order : orderList) {
         order.execute();
      }
      orderList.clear();
   }
}
```

## Step 5

Use the Broker class to take and execute commands.

_CommandPatternDemo.java_

```
public class CommandPatternDemo {
   public static void main(String[] args) {
      Stock abcStock = new Stock();

      BuyStock buyStockOrder = new BuyStock(abcStock);
      SellStock sellStockOrder = new SellStock(abcStock);

      Broker broker = new Broker();
      broker.takeOrder(buyStockOrder);
      broker.takeOrder(sellStockOrder);

      broker.placeOrders();
   }
}
```

## Step 6

Verify the output.

```
Stock [ Name: ABC, Quantity: 10 ] bought
Stock [ Name: ABC, Quantity: 10 ] sold

```