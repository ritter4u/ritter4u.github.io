___

  

Interpreter pattern provides a way to evaluate language grammar or expression. This type of pattern comes under behavioral pattern. This pattern involves implementing an expression interface which tells to interpret a particular context. This pattern is used in SQL parsing, symbol processing engine etc.

## Implementation

We are going to create an interface _Expression_ and concrete classes implementing the _Expression_ interface. A class _TerminalExpression_ is defined which acts as a main interpreter of context in question. Other classes _OrExpression_, _AndExpression_ are used to create combinational expressions.

_InterpreterPatternDemo_, our demo class, will use _Expression_ class to create rules and demonstrate parsing of expressions.

![Interpreter Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/interpreter_pattern_uml_diagram.jpg)

## Step 1

Create an expression interface.

_Expression.java_

```
public interface Expression {
   public boolean interpret(String context);
}
```

## Step 2

Create concrete classes implementing the above interface.

_TerminalExpression.java_

```
public class TerminalExpression implements Expression {

   private String data;

   public TerminalExpression(String data){
      this.data = data; 
   }

   @Override
   public boolean interpret(String context) {
   
      if(context.contains(data)){
         return true;
      }
      return false;
   }
}
```

_OrExpression.java_

```
public class OrExpression implements Expression {
 
   private Expression expr1 = null;
   private Expression expr2 = null;

   public OrExpression(Expression expr1, Expression expr2) { 
      this.expr1 = expr1;
      this.expr2 = expr2;
   }

   @Override
   public boolean interpret(String context) {
      return expr1.interpret(context) || expr2.interpret(context);
   }
}
```

_AndExpression.java_

```
public class AndExpression implements Expression {
 
   private Expression expr1 = null;
   private Expression expr2 = null;

   public AndExpression(Expression expr1, Expression expr2) { 
      this.expr1 = expr1;
      this.expr2 = expr2;
   }

   @Override
   public boolean interpret(String context) {
      return expr1.interpret(context) && expr2.interpret(context);
   }
}
```

## Step 3

_InterpreterPatternDemo_ uses _Expression_ class to create rules and then parse them.

_InterpreterPatternDemo.java_

```
public class InterpreterPatternDemo {

   //Rule: Robert and John are male
   public static Expression getMaleExpression(){
      Expression robert = new TerminalExpression("Robert");
      Expression john = new TerminalExpression("John");
      return new OrExpression(robert, john);
   }

   //Rule: Julie is a married women
   public static Expression getMarriedWomanExpression(){
      Expression julie = new TerminalExpression("Julie");
      Expression married = new TerminalExpression("Married");
      return new AndExpression(julie, married);
   }

   public static void main(String[] args) {
      Expression isMale = getMaleExpression();
      Expression isMarriedWoman = getMarriedWomanExpression();

      System.out.println("John is male? " + isMale.interpret("John"));
      System.out.println("Julie is a married women? " + isMarriedWoman.interpret("Married Julie"));
   }
}
```

## Step 4

Verify the output.

```
John is male? true
Julie is a married women? true

```