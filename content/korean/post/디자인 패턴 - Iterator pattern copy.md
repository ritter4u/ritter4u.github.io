___

  

Iterator pattern is very commonly used design pattern in Java and .Net programming environment. This pattern is used to get a way to access the elements of a collection object in sequential manner without any need to know its underlying representation.

Iterator pattern falls under behavioral pattern category.

## Implementation

We're going to create a _Iterator_ interface which narrates navigation method and a _Container_ interface which retruns the iterator . Concrete classes implementing the _Container_ interface will be responsible to implement _Iterator_ interface and use it

_IteratorPatternDemo_, our demo class will use _NamesRepository_, a concrete class implementation to print a _Names_ stored as a collection in _NamesRepository_.

![Iterator Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/iterator_pattern_uml_diagram.jpg)

## Step 1

Create interfaces.

_Iterator.java_

```
public interface Iterator {
   public boolean hasNext();
   public Object next();
}
```

_Container.java_

```
public interface Container {
   public Iterator getIterator();
}
```

## Step 2

Create concrete class implementing the _Container_ interface. This class has inner class _NameIterator_ implementing the _Iterator_ interface.

_NameRepository.java_

```
public class NameRepository implements Container {
   public String names[] = {"Robert" , "John" ,"Julie" , "Lora"};

   @Override
   public Iterator getIterator() {
      return new NameIterator();
   }

   private class NameIterator implements Iterator {

      int index;

      @Override
      public boolean hasNext() {
      
         if(index < names.length){
            return true;
         }
         return false;
      }

      @Override
      public Object next() {
      
         if(this.hasNext()){
            return names[index++];
         }
         return null;
      }
   }
}
```

## Step 3

Use the _NameRepository_ to get iterator and print names.

_IteratorPatternDemo.java_

```
public class IteratorPatternDemo {

   public static void main(String[] args) {
      NameRepository namesRepository = new NameRepository();

      for(Iterator iter = namesRepository.getIterator(); iter.hasNext();){
         String name = (String)iter.next();
         System.out.println("Name : " + name);
      } 
   }
}
```

## Step 4

Verify the output.

```
Name : Robert
Name : John
Name : Julie
Name : Lora

```