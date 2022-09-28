___

  

In State pattern a class behavior changes based on its state. This type of design pattern comes under behavior pattern.

In State pattern, we create objects which represent various states and a context object whose behavior varies as its state object changes.

## Implementation

We are going to create a _State_ interface defining an action and concrete state classes implementing the _State_ interface. _Context_ is a class which carries a State.

_StatePatternDemo_, our demo class, will use _Context_ and state objects to demonstrate change in Context behavior based on type of state it is in.

![State Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/state_pattern_uml_diagram.jpg)

## Step 1

Create an interface.

_State.java_

```
public interface State {
   public void doAction(Context context);
}
```

## Step 2

Create concrete classes implementing the same interface.

_StartState.java_

```
public class StartState implements State {

   public void doAction(Context context) {
      System.out.println("Player is in start state");
      context.setState(this);
   }

   public String toString(){
      return "Start State";
   }
}
```

_StopState.java_

```
public class StopState implements State {

   public void doAction(Context context) {
      System.out.println("Player is in stop state");
      context.setState(this);
   }

   public String toString(){
      return "Stop State";
   }
}
```

## Step 3

Create _Context_ Class.

_Context.java_

```
public class Context {
   private State state;

   public Context(){
      state = null;
   }

   public void setState(State state){
      this.state = state;
   }

   public State getState(){
      return state;
   }
}
```

## Step 4

Use the _Context_ to see change in behaviour when _State_ changes.

_StatePatternDemo.java_

```
public class StatePatternDemo {
   public static void main(String[] args) {
      Context context = new Context();

      StartState startState = new StartState();
      startState.doAction(context);

      System.out.println(context.getState().toString());

      StopState stopState = new StopState();
      stopState.doAction(context);

      System.out.println(context.getState().toString());
   }
}
```

## Step 5

Verify the output.

```
Player is in start state
Start State
Player is in stop state
Stop State

```