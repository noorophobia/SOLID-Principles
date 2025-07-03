import React, { useState } from "react";
import "./App.css";

const principles = [
  {
    id: "srp",
    title: "Single Responsibility Principle (SRP)",
    before: `// Before SRP
class User {
    private String name;
    private String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    // Responsibility 1: User Data Management
    public void saveUser() {
        System.out.println("User " + this.name + " saved to database.");
        // ... actual database saving logic ...
    }

    // Responsibility 2: Email Communication
    public void sendWelcomeEmail() {
        System.out.println("Sending welcome email to " + this.email + "...");
        // ... email sending code ...
        System.out.println("Email sent!");
    }

    // Responsibility 3: Reporting
    public void generateUserReport() {
        System.out.println("Generating report for " + this.name + "...");
        // ... report generation code ...
        System.out.println("Report generated!");
    }
}

// Usage
public class SrpViolation {
    public static void main(String[] args) {
        User user = new User("Alice", "alice@example.com");
        user.saveUser();
        user.sendWelcomeEmail();
        user.generateUserReport();
    }
}`,
    after: `// After SRP

class User {
    private String name;
    private String email;

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getUserInfo() {
        return "Name: " + name + ", Email: " + email;
    }
}

class UserRepository {
    public void save(User user) {
        System.out.println("Saving user " + user.getName() + " to database.");
        // ... actual database saving logic ...
    }
}

class EmailService {
    public void sendWelcomeEmail(User user) {
        System.out.println("Sending welcome email to " + user.getEmail() + "...");
        // ... email sending code ...
        System.out.println("Email sent!");
    }
}

class UserReportGenerator {
    public void generateReport(User user) {
        System.out.println("Generating report for " + user.getName() + "...");
        // ... report generation code ...
        System.out.println("Report generated!");
    }
}

// Usage
public class SrpAdherence {
    public static void main(String[] args) {
        User user = new User("Bob", "bob@example.com");
        UserRepository userRepository = new UserRepository();
        EmailService emailService = new EmailService();
        UserReportGenerator reportGenerator = new UserReportGenerator();

        userRepository.save(user);
        emailService.sendWelcomeEmail(user);
        reportGenerator.generateReport(user);
    }
}`
  },
  {
    id: "ocp",
    title: "Open/Closed Principle (OCP)",
    before: `// Before OCP
class Rectangle {
    public double width;
    public double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }
}

class Circle {
    public double radius;

    public Circle(double radius) {
        this.radius = radius;
    }
}

class AreaCalculator {
    public double calculateArea(Object[] shapes) {
        double totalArea = 0;
        for (Object shape : shapes) {
            if (shape instanceof Rectangle) {
                Rectangle rect = (Rectangle) shape;
                totalArea += rect.width * rect.height;
            } else if (shape instanceof Circle) {
                Circle circle = (Circle) shape;
                totalArea += Math.PI * circle.radius * circle.radius;
            }
            // PROBLEM: If we add a new shape (e.g., Triangle),
            // we have to modify THIS method to add another 'else if'.
        }
        return totalArea;
    }
}

// Usage
public class OcpViolation {
    public static void main(String[] args) {
        Rectangle rect = new Rectangle(10, 5);
        Circle circ = new Circle(7);
        AreaCalculator calculator = new AreaCalculator();
        
        Object[] shapes = {rect, circ};
        System.out.println("Total area: " + calculator.calculateArea(shapes));
    }
}`,
    after: `// After OCP

interface Shape {
    double area();
}

class Rectangle implements Shape {
    private double width;
    private double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}

class Circle implements Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

class Triangle implements Shape { // New shape, no modification to AreaCalculator needed!
    private double base;
    private double height;

    public Triangle(double base, double height) {
        this.base = base;
        this.height = height;
    }

    @Override
    public double area() {
        return 0.5 * base * height;
    }
}

class AreaCalculator {
    public double calculateTotalArea(Shape[] shapes) {
        double totalArea = 0;
        for (Shape shape : shapes) {
            totalArea += shape.area(); // Polymorphism in action!
        }
        return totalArea;
    }
}

// Usage
public class OcpAdherence {
    public static void main(String[] args) {
        Rectangle rect = new Rectangle(10, 5);
        Circle circ = new Circle(7);
        Triangle tri = new Triangle(6, 4); // Easily add new shape without modifying AreaCalculator

        Shape[] shapes = {rect, circ, tri};
        AreaCalculator calculator = new AreaCalculator();
        System.out.println("Total area: " + calculator.calculateTotalArea(shapes));
    }
}`
  },
  {
    id: "lsp",
    title: "Liskov Substitution Principle (LSP)",
    before: `// Before LSP
class Rectangle {
    protected double width;
    protected double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double getWidth() { return width; }
    public void setWidth(double width) { this.width = width; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getArea() {
        return width * height;
    }
}

class Square extends Rectangle {
    public Square(double side) {
        super(side, side);
    }

    // PROBLEM: These setters change both width and height,
    // violating the expectation of a Rectangle's individual setters.
    @Override
    public void setWidth(double width) {
        this.width = width;
        this.height = width; // Violates Rectangle's contract
    }

    @Override
    public void setHeight(double height) {
        this.width = height; // Violates Rectangle's contract
        this.height = height;
    }
}

public class LspViolation {
    public static void enforceRectangleBehavior(Rectangle r) {
        r.setWidth(5);
        r.setHeight(10);
        // We expect width=5, height=10 for a Rectangle.
        // For a Square, this will result in width=10, height=10.
        System.out.println("Expected area (5x10=50). Actual area: " + r.getArea());
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle(2, 3);
        System.out.println("Rectangle initial area: " + rect.getArea()); // 6
        enforceRectangleBehavior(rect); // Correct: 50

        System.out.println("---");

        Rectangle square = new Square(3); // Square used as Rectangle
        System.out.println("Square initial area: " + square.getArea()); // 9
        enforceRectangleBehavior(square); // Problem: Not 50, but 100! Breaks client expectation.
    }
}`,
    after: `// After LSP

interface Shape {
    double getArea();
}

class Rectangle implements Shape {
    protected double width;
    protected double height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    public double getWidth() { return width; }
    public void setWidth(double width) { this.width = width; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    @Override
    public double getArea() {
        return width * height;
    }
}

class Square implements Shape { // Square is a Shape, not necessarily a Rectangle for property setters
    private double side;

    public Square(double side) {
        this.side = side;
    }

    public double getSide() { return side; }
    public void setSide(double side) { this.side = side; }

    @Override
    public double getArea() {
        return side * side;
    }
}

public class LspAdherence {
    public static void printShapeArea(Shape shape) {
        System.out.println("Shape area: " + shape.getArea());
    }

    public static void main(String[] args) {
        Rectangle rect = new Rectangle(10, 5);
        Square sq = new Square(5);

        printShapeArea(rect); // Works as expected
        printShapeArea(sq);   // Works as expected
    }
}`
  },
  {
    id: "isp",
    title: "Interface Segregation Principle (ISP)",
    before: `// Before ISP
interface Worker {
    void work();
    void eat();
    void sleep();
}

class HumanWorker implements Worker {
    @Override
    public void work() {
        System.out.println("Human working hard.");
    }
    @Override
    public void eat() {
        System.out.println("Human eating lunch.");
    }
    @Override
    public void sleep() {
        System.out.println("Human sleeping soundly.");
    }
}

class RobotWorker implements Worker {
    @Override
    public void work() {
        System.out.println("Robot working tirelessly.");
    }
    @Override
    public void eat() {
        // PROBLEM: Robots don't eat! Forced to implement this.
        throw new UnsupportedOperationException("Robots don't eat!");
    }
    @Override
    public void sleep() {
        // PROBLEM: Robots don't sleep! Forced to implement this.
        throw new UnsupportedOperationException("Robots don't sleep!");
    }
}

public class IspViolation {
    public static void main(String[] args) {
        HumanWorker human = new HumanWorker();
        human.work();
        human.eat();
        human.sleep();

        RobotWorker robot = new RobotWorker();
        robot.work();
        try {
            robot.eat(); // This will throw an error, but the interface forced its existence.
        } catch (UnsupportedOperationException e) {
            System.out.println(e.getMessage());
        }
    }
}`,
    after: `// After ISP

interface Workable {
    void work();
}

interface Eatable {
    void eat();
}

interface Sleepable {
    void sleep();
}

class HumanWorker implements Workable, Eatable, Sleepable {
    @Override
    public void work() {
        System.out.println("Human working hard.");
    }
    @Override
    public void eat() {
        System.out.println("Human eating lunch.");
    }
    @Override
    public void sleep() {
        System.out.println("Human sleeping soundly.");
    }
}

class RobotWorker implements Workable { // Only implements what it needs
    @Override
    public void work() {
        System.out.println("Robot working tirelessly.");
    }
}

public class IspAdherence {
    public static void main(String[] args) {
        HumanWorker human = new HumanWorker();
        human.work();
        human.eat();
        human.sleep();

        RobotWorker robot = new RobotWorker();
        robot.work();
        // robot.eat() would not even compile, as RobotWorker doesn't implement Eatable.
    }
}`
  },
  {
    id: "dip",
    title: "Dependency Inversion Principle (DIP)",
    before: `// Before DIP

class CreditCardProcessor { // Low-level module (concrete implementation)
    public void processCreditCardPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // ... actual credit card processing logic ...
    }
}

class DebitCardProcessor { // Another low-level module
    public void processDebitCardPayment(double amount) {
        System.out.println("Processing debit card payment of $" + amount);
        // ... actual debit card processing logic ...
    }
}

class PaymentProcessor { // High-level module
    private CreditCardProcessor creditCardProcessor; // Direct dependency on concrete class

    public PaymentProcessor() {
        this.creditCardProcessor = new CreditCardProcessor(); // Instantiating concrete dependency
    }

    public void makeCreditCardPayment(double amount) {
        creditCardProcessor.processCreditCardPayment(amount);
        System.out.println("Credit card payment successful.");
    }

    // PROBLEM: To add DebitCard, we'd need another method and another direct dependency,
    // or modify this class significantly.
}

// Usage
public class DipViolation {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        processor.makeCreditCardPayment(100.0);
    }
}`,
    after: `// After DIP

interface PaymentGateway { // Abstraction
    void processPayment(double amount);
}

class CreditCardGateway implements PaymentGateway { // Low-level module depends on abstraction
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // ... actual credit card processing logic ...
    }
}

class DebitCardGateway implements PaymentGateway { // Another low-level module depends on abstraction
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing debit card payment of $" + amount);
        // ... actual debit card processing logic ...
    }
}

class PaymentProcessor { // High-level module depends on abstraction
    private PaymentGateway paymentGateway; // Dependency on abstraction

    // Dependency Injection: Pass the dependency through the constructor
    public PaymentProcessor(PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    public void makePayment(double amount) {
        paymentGateway.processPayment(amount);
        System.out.println("Payment successful.");
    }
}

// Usage
public class DipAdherence {
    public static void main(String[] args) {
        // High-level module (PaymentProcessor) doesn't care about the concrete type,
        // only that it implements PaymentGateway.
        
        PaymentGateway creditCardGateway = new CreditCardGateway();
        PaymentProcessor creditCardProcessor = new PaymentProcessor(creditCardGateway);
        creditCardProcessor.makePayment(100.0);

        System.out.println("---");

        PaymentGateway debitCardGateway = new DebitCardGateway();
        PaymentProcessor debitCardProcessor = new PaymentProcessor(debitCardGateway);
        debitCardProcessor.makePayment(50.0);

        // Easily switch or add new payment methods without changing PaymentProcessor
    }
}`
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState("srp");

  return (
    <div className="page-container">
      <h1>SOLID Principles in Java</h1>

      <div className="tabs">
        {principles.map(p => (
          <button
            key={p.id}
            className={`tab-button ${p.id === activeTab ? "active" : ""}`}
            onClick={() => setActiveTab(p.id)}
          >
            {p.id.toUpperCase()}
          </button>
        ))}
      </div>

      {principles
        .filter(p => p.id === activeTab)
        .map(p => (
          <div key={p.id}>
            <h2>{p.title}</h2>
            <div className="code-card">
              <div className="code-title">Before</div>
              <pre>{p.before}</pre>
            </div>
            <div className="code-card">
              <div className="code-title">After</div>
              <pre>{p.after}</pre>
            </div>
          </div>
        ))}

      <div className="footer">
        If you found this helpful, please <strong>like</strong>, <strong>share</strong>, and{" "}
        <strong>subscribe</strong>! 💙<br />
        <small>Support a jobless dev trying to make it in tech 😅</small>
      </div>
    </div>
  );
}
