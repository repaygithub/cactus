# Getting Started

The best way to get started with Cactus, is to use our CLI `@repay/create-ui`. This tool provides a basic configuration and structure to start implementing a website using all the cactus resources.

## The CLI
 The CLI will generate a boilerplate with a basic configuration depending on the arguments you pass or the answers you provide to the prompts. The options are

| Argument     | Action                                                                                 |
|--------------|----------------------------------------------------------------------------------------|
| `<app-name>` | The name for your app. You'll find the generated code under a folder with this name |
| --javascript | Generate the app with javascript configuration                                         |
| --typescript | Generate the app with typescript configuration                                         |
| --git, -g    | Initialize a git repository                                                            |

For example:
```shell
create-repay-ui myapp --typescript -g
```
Will generate an app under `myapp` folder, with typescript and a git repository.


## How to start
 To start, you will need to add the `@repay/create-ui` globally: 
 ```shell 
 yarn global add @repay/create-ui
 ```
After this is done, you are free to use the tool as described above

We recommend you use `Yarn` instead of `NPM` since all the dependencies are handle through `Yarn`