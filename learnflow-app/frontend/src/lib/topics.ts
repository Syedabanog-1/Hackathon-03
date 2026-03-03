export interface Topic {
  id: string;
  name: string;
  starterCode: string;
}

export interface Module {
  name: string;
  slug: string;
  topics: Topic[];
}

export const MODULES: Module[] = [
  {
    name: "1. Basics",
    slug: "basics",
    topics: [
      {
        id: "variables",
        name: "Variables & Data Types",
        starterCode: `# Variables and Data Types
name = "Alice"
age = 25
height = 5.6
is_student = True

print(f"Name: {name}")
print(f"Age: {age}, Height: {height}")
print(f"Is student: {is_student}")
`,
      },
      {
        id: "strings",
        name: "Strings",
        starterCode: `# String Methods
text = "Hello, Python!"
print(text.upper())
print(text.lower())
print(text.replace("Python", "LearnFlow"))
print(len(text))
print(text.split(", "))
`,
      },
      {
        id: "operators",
        name: "Operators",
        starterCode: `# Operators
a, b = 10, 3
print(a + b, a - b, a * b)
print(a / b)   # true division
print(a // b)  # floor division
print(a % b)   # modulo
print(a ** b)  # power
`,
      },
    ],
  },
  {
    name: "2. Control Flow",
    slug: "control-flow",
    topics: [
      {
        id: "if-else",
        name: "If / Else",
        starterCode: `# If / Else
score = 75
if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
else:
    print("Grade: F")
`,
      },
      {
        id: "for-loops",
        name: "For Loops",
        starterCode: `# For Loops
for i in range(5):
    print(f"Count: {i}")

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
`,
      },
      {
        id: "while-loops",
        name: "While Loops",
        starterCode: `# While Loops
count = 0
while count < 5:
    print(f"count = {count}")
    count += 1
`,
      },
      {
        id: "comprehensions",
        name: "List Comprehensions",
        starterCode: `# List Comprehensions
squares = [x**2 for x in range(10)]
print(squares)

evens = [x for x in range(20) if x % 2 == 0]
print(evens)
`,
      },
    ],
  },
  {
    name: "3. Data Structures",
    slug: "data-structures",
    topics: [
      {
        id: "lists",
        name: "Lists",
        starterCode: `# Lists
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
fruits.remove("banana")
print(fruits)
print(fruits[0], fruits[-1])
print(sorted(fruits))
`,
      },
      {
        id: "dictionaries",
        name: "Dictionaries",
        starterCode: `# Dictionaries
student = {"name": "Alice", "age": 20, "grade": "A"}
print(student["name"])
student["age"] = 21
for key, value in student.items():
    print(f"{key}: {value}")
`,
      },
      {
        id: "tuples-sets",
        name: "Tuples & Sets",
        starterCode: `# Tuples and Sets
coords = (10, 20)
print(coords[0], coords[1])

unique = {3, 1, 2, 2, 1}
print(sorted(unique))  # {1, 2, 3}
unique.add(4)
print(sorted(unique))
`,
      },
    ],
  },
  {
    name: "4. Functions",
    slug: "functions",
    topics: [
      {
        id: "defining-functions",
        name: "Defining Functions",
        starterCode: `# Defining Functions
def greet(name: str) -> str:
    return f"Hello, {name}!"

def add(a: int, b: int) -> int:
    return a + b

print(greet("Alice"))
print(add(3, 4))
`,
      },
      {
        id: "lambda",
        name: "Lambda & map/filter",
        starterCode: `# Lambda, map, filter
double = lambda x: x * 2
square = lambda x: x ** 2

numbers = [1, 2, 3, 4, 5]
print(list(map(square, numbers)))
print(list(filter(lambda x: x > 2, numbers)))
`,
      },
      {
        id: "recursion",
        name: "Recursion",
        starterCode: `# Recursion
def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(factorial(5))
print([fibonacci(i) for i in range(8)])
`,
      },
    ],
  },
  {
    name: "5. OOP",
    slug: "oop",
    topics: [
      {
        id: "classes",
        name: "Classes & Objects",
        starterCode: `# Classes and Objects
class Dog:
    def __init__(self, name: str, breed: str):
        self.name = name
        self.breed = breed

    def bark(self) -> str:
        return f"{self.name} says: Woof!"

dog = Dog("Buddy", "Labrador")
print(dog.bark())
print(dog.name, dog.breed)
`,
      },
      {
        id: "inheritance",
        name: "Inheritance",
        starterCode: `# Inheritance
class Animal:
    def __init__(self, name: str):
        self.name = name
    def speak(self) -> str:
        return "..."

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name}: Meow!"

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name}: Woof!"

for a in [Cat("Whiskers"), Dog("Rex")]:
    print(a.speak())
`,
      },
    ],
  },
  {
    name: "6. Files",
    slug: "files",
    topics: [
      {
        id: "file-io",
        name: "Reading & Writing",
        starterCode: `# File I/O (simulated with StringIO)
import io

buf = io.StringIO()
buf.write("Hello\nWorld\nPython\n")
buf.seek(0)

for line in buf.readlines():
    print(line.strip())
`,
      },
      {
        id: "json",
        name: "JSON",
        starterCode: `# JSON
import json

data = {"name": "Alice", "scores": [95, 87, 92]}
json_str = json.dumps(data, indent=2)
print(json_str)

parsed = json.loads(json_str)
avg = sum(parsed["scores"]) / len(parsed["scores"])
print(f"Average: {avg:.1f}")
`,
      },
    ],
  },
  {
    name: "7. Error Handling",
    slug: "error-handling",
    topics: [
      {
        id: "try-except",
        name: "Try / Except",
        starterCode: `# Try / Except
def safe_divide(a: float, b: float) -> float:
    try:
        return a / b
    except ZeroDivisionError:
        print("Error: Cannot divide by zero")
        return 0.0
    finally:
        print("Division attempted")

print(safe_divide(10, 2))
print(safe_divide(10, 0))
`,
      },
      {
        id: "custom-exceptions",
        name: "Custom Exceptions",
        starterCode: `# Custom Exceptions
class ValidationError(Exception):
    pass

def validate_age(age: int) -> int:
    if age < 0:
        raise ValidationError(f"Age cannot be negative: {age}")
    if age > 150:
        raise ValidationError(f"Unrealistic age: {age}")
    return age

try:
    print(validate_age(25))
    print(validate_age(-5))
except ValidationError as e:
    print(f"Validation failed: {e}")
`,
      },
    ],
  },
  {
    name: "8. Libraries",
    slug: "libraries",
    topics: [
      {
        id: "math-random",
        name: "math & random",
        starterCode: `# math and random
import math
import random

print(math.pi, math.e)
print(math.sqrt(16))
print(math.factorial(5))

random.seed(42)
print(random.randint(1, 100))
print(random.choice(["apple", "banana", "cherry"]))
`,
      },
      {
        id: "datetime",
        name: "datetime",
        starterCode: `# datetime
from datetime import datetime, timedelta

now = datetime.now()
print(f"Now: {now.strftime('%Y-%m-%d %H:%M')}")

tomorrow = now + timedelta(days=1)
print(f"Tomorrow: {tomorrow.strftime('%Y-%m-%d')}")
`,
      },
      {
        id: "collections",
        name: "collections",
        starterCode: `# collections
from collections import Counter, defaultdict

words = ["apple", "banana", "apple", "cherry", "banana", "apple"]
counts = Counter(words)
print(counts.most_common(3))

groups: defaultdict = defaultdict(list)
for word in words:
    groups[word[0]].append(word)
print(dict(groups))
`,
      },
    ],
  },
];

export const TOPIC_MAP: Record<string, { name: string; starterCode: string; moduleName: string }> = {};
MODULES.forEach((mod) => {
  mod.topics.forEach((topic) => {
    TOPIC_MAP[topic.id] = {
      name: topic.name,
      starterCode: topic.starterCode,
      moduleName: mod.name,
    };
  });
});
