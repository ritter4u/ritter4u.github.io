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

  

In proxy pattern, a class represents functionality of another class. This type of design pattern comes under structural pattern.

In proxy pattern, we create object having original object to interface its functionality to outer world.

## Implementation

We are going to create an _Image_ interface and concrete classes implementing the _Image_ interface. _ProxyImage_ is a a proxy class to reduce memory footprint of _RealImage_ object loading.

_ProxyPatternDemo_, our demo class, will use _ProxyImage_ to get an _Image_ object to load and display as it needs.

![Proxy Pattern UML Diagram](https://www.tutorialspoint.com/design_pattern/images/proxy_pattern_uml_diagram.jpg)

## Step 1

Create an interface.

_Image.java_

```
public interface Image {
   void display();
}
```

## Step 2

Create concrete classes implementing the same interface.

_RealImage.java_

```
public class RealImage implements Image {

   private String fileName;

   public RealImage(String fileName){
      this.fileName = fileName;
      loadFromDisk(fileName);
   }

   @Override
   public void display() {
      System.out.println("Displaying " + fileName);
   }

   private void loadFromDisk(String fileName){
      System.out.println("Loading " + fileName);
   }
}
```

_ProxyImage.java_

```
public class ProxyImage implements Image{

   private RealImage realImage;
   private String fileName;

   public ProxyImage(String fileName){
      this.fileName = fileName;
   }

   @Override
   public void display() {
      if(realImage == null){
         realImage = new RealImage(fileName);
      }
      realImage.display();
   }
}
```

## Step 3

Use the _ProxyImage_ to get object of _RealImage_ class when required.

_ProxyPatternDemo.java_

```
public class ProxyPatternDemo {

   public static void main(String[] args) {
      Image image = new ProxyImage("test_10mb.jpg");

      //image will be loaded from disk
      image.display(); 
      System.out.println("");
      
      //image will not be loaded from disk
      image.display(); 
   }
}
```

## Step 4

Verify the output.

```
Loading test_10mb.jpg
Displaying test_10mb.jpg

Displaying test_10mb.jpg

```