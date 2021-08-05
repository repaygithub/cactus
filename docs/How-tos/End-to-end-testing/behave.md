# Behave

[Behave](https://behave.readthedocs.io/en/latest/index.html) is a python based implementation of cucumber. Running UI tests in this manner will allow us more transparency in how we expect our applications to operate. We will be coupling this with [selenium](https://selenium-python.readthedocs.io/). 

The long term goal is to run a very significant amount of tests rapidly and in parallel, either with our own home grown grid in AWS or executing within BrowserStack.

## Cloning Template Project

This project will require
- python 3.8+
- docker-compose

While we keep exploring how Testing as a Service will work within Repay, our template project can be pulled and test development can be started.

```
clone link from sample project
```

## Executing Tests

First install required python dependencies
```terminal
pip install -r requirements.txt
```

Then open a shell and start the grid. It can either be run detached or attached if you'd prefer to see output in a separate window.

```
docker-compose up

# or detached

docker-compose up -d
```

Then run the example test
```
behave
```