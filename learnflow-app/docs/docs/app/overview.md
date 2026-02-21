---
sidebar_position: 1
---

# LearnFlow Application Overview

## Product Summary

LearnFlow is an AI-powered Python tutoring platform where:
- **Students** chat with AI tutors, write and run Python code, take quizzes, and track mastery
- **Teachers** monitor class progress, receive struggle alerts, and generate custom exercises

## Mastery System

Topic mastery is calculated as a weighted average:

| Component | Weight |
|-----------|--------|
| Exercise completion | 40% |
| Quiz scores | 30% |
| Code quality ratings | 20% |
| Consistency (streak) | 10% |

**Mastery Levels:**
- 0–40% → Beginner (Red)
- 41–70% → Learning (Yellow)
- 71–90% → Proficient (Green)
- 91–100% → Mastered (Blue)

## Python Curriculum

| Module | Topics |
|--------|--------|
| 1. Basics | Variables, Data Types, I/O, Operators |
| 2. Control Flow | if/elif/else, for/while loops |
| 3. Data Structures | Lists, Tuples, Dicts, Sets |
| 4. Functions | Parameters, Return values, Scope |
| 5. OOP | Classes, Inheritance, Encapsulation |
| 6. Files | Reading/Writing, CSV, JSON |
| 7. Errors | Try/Except, Custom Exceptions |
| 8. Libraries | pip, APIs, Virtual Environments |

## Demo Scenario

1. Student Maya logs in → Dashboard: "Module 2: Loops - 60% complete"
2. Maya asks: "How do for loops work in Python?"
3. Concepts Agent explains with code examples
4. Maya writes a for loop, runs it successfully
5. Agent offers quiz → Maya gets 4/5 → Mastery updates to 68%
6. Student James struggles with list comprehensions → 3 wrong answers
7. Struggle alert → Teacher Mr. Rodriguez notified
8. Teacher generates exercises → James assigned → Confidence restored
