___

  

In Visitor pattern, we use a visitor class which changes the executing algorithm of an element class. By this way, execution algorithm of element can vary as and when visitor varies. This pattern comes under behavior pattern category. As per the pattern, element object has to accept the visitor object so that visitor object handles the operation on the element object.

## Implementation

We are going to create a _ComputerPart_ interface defining accept opearation._Keyboard_, _Mouse_, _Monitor_ and _Computer_ are concrete classes implementing _ComputerPart_ interface. We will define another interface _ComputerPartVisitor_ which will define a visitor class operations. _Computer_ uses concrete visitor to do corresponding action.

_VisitorPatternDemo_, our demo class, will use _Computer_ and _ComputerPartVisitor_ classes to demonstrate use of visitor pattern.

![Visitor Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/visitor_pattern_uml_diagram.jpg)

## Step 1

Define an interface to represent element.

_ComputerPart.java_

```
public interface ComputerPart {
   public void accept(ComputerPartVisitor computerPartVisitor);
}
```

## Step 2

Create concrete classes extending the above class.

_Keyboard.java_

```
public class Keyboard implements ComputerPart {

   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}
```

_Monitor.java_

```
public class Monitor implements ComputerPart {

   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}
```

_Mouse.java_

```
public class Mouse implements ComputerPart {

   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      computerPartVisitor.visit(this);
   }
}
```

_Computer.java_

```
public class Computer implements ComputerPart {

   ComputerPart[] parts;

   public Computer(){
      parts = new ComputerPart[] {new Mouse(), new Keyboard(), new Monitor()};
   } 


   @Override
   public void accept(ComputerPartVisitor computerPartVisitor) {
      for (int i = 0; i < parts.length; i++) {
         parts[i].accept(computerPartVisitor);
      }
      computerPartVisitor.visit(this);
   }
}
```

## Step 3

Define an interface to represent visitor.

_ComputerPartVisitor.java_

```
public interface ComputerPartVisitor {
public void visit(Computer computer);
public void visit(Mouse mouse);
public void visit(Keyboard keyboard);
public void visit(Monitor monitor);
}
```

## Step 4

Create concrete visitor implementing the above class.

_ComputerPartDisplayVisitor.java_

```
public class ComputerPartDisplayVisitor implements ComputerPartVisitor {

   @Override
   public void visit(Computer computer) {
      System.out.println("Displaying Computer.");
   }

   @Override
   public void visit(Mouse mouse) {
      System.out.println("Displaying Mouse.");
   }

   @Override
   public void visit(Keyboard keyboard) {
      System.out.println("Displaying Keyboard.");
   }

   @Override
   public void visit(Monitor monitor) {
      System.out.println("Displaying Monitor.");
   }
}
```

## Step 5

Use the _ComputerPartDisplayVisitor_ to display parts of _Computer_.

_VisitorPatternDemo.java_

```
public class VisitorPatternDemo {
   public static void main(String[] args) {

      ComputerPart computer = new Computer();
      computer.accept(new ComputerPartDisplayVisitor());
   }
}
```

## Step 6

Verify the output.

```
Displaying Mouse.
Displaying Keyboard.
Displaying Monitor.
Displaying Computer.

```