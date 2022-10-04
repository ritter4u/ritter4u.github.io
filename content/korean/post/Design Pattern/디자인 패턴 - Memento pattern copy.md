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

  

Memento pattern is used to restore state of an object to a previous state. Memento pattern falls under behavioral pattern category.

## Implementation

Memento pattern uses three actor classes. Memento contains state of an object to be restored. Originator creates and stores states in Memento objects and Caretaker object is responsible to restore object state from Memento. We have created classes _Memento_, _Originator_ and _CareTaker_.

_MementoPatternDemo_, our demo class, will use _CareTaker_ and _Originator_ objects to show restoration of object states.

![Memento Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/memento_pattern_uml_diagram.jpg)

## Step 1

Create Memento class.

_Memento.java_

```
public class Memento {
   private String state;

   public Memento(String state){
      this.state = state;
   }

   public String getState(){
      return state;
   }
}
```

## Step 2

Create Originator class

_Originator.java_

```
public class Originator {
   private String state;

   public void setState(String state){
      this.state = state;
   }

   public String getState(){
      return state;
   }

   public Memento saveStateToMemento(){
      return new Memento(state);
   }

   public void getStateFromMemento(Memento memento){
      state = memento.getState();
   }
}
```

## Step 3

Create CareTaker class

_CareTaker.java_

```
import java.util.ArrayList;
import java.util.List;

public class CareTaker {
   private List<Memento> mementoList = new ArrayList<Memento>();

   public void add(Memento state){
      mementoList.add(state);
   }

   public Memento get(int index){
      return mementoList.get(index);
   }
}
```

## Step 4

Use _CareTaker_ and _Originator_ objects.

_MementoPatternDemo.java_

```
public class MementoPatternDemo {
   public static void main(String[] args) {
   
      Originator originator = new Originator();
      CareTaker careTaker = new CareTaker();
      
      originator.setState("State #1");
      originator.setState("State #2");
      careTaker.add(originator.saveStateToMemento());
      
      originator.setState("State #3");
      careTaker.add(originator.saveStateToMemento());
      
      originator.setState("State #4");
      System.out.println("Current State: " + originator.getState());
      
      originator.getStateFromMemento(careTaker.get(0));
      System.out.println("First saved State: " + originator.getState());
      originator.getStateFromMemento(careTaker.get(1));
      System.out.println("Second saved State: " + originator.getState());
   }
}
```

## Step 5

Verify the output.

```
Current State: State #4
First saved State: State #2
Second saved State: State #3

```