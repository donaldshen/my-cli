# my-cli
> 学习用node和各类库写cli-tool

A simple CLI for scaffolding any projects. Learn from vue-cli.

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=8.x), npm version 3+ and [Git](https://git-scm.com/).

``` bash
$ git clone https://github.com/donaldshen/my-cli.git
$ npm install
$ npm link
```

### Usage

``` bash
$ my init <template-name> <project-name>
```

Example:

``` bash
$ my init webpack my-project
```

The above command pulls the template from [vuejs-templates/webpack](https://github.com/vuejs-templates/webpack), prompts for some information, and generates the project at `./my-project/`.

### Official Vue Templates

vuejs-templates的template不完全符合my-cli的标准，详情看prompt.when和filters的要求。不使用js expression是为了不用with和eval表达式

### Github Templates

You can simply fork an template from Github and then use it via `my-cli` with:

``` bash
my init username/repo my-project
```

Where `username/repo` is the GitHub repo shorthand for your fork.

The shorthand repo notation is passed to [download-git-repo](https://github.com/flipxfx/download-git-repo) so you can also use things like `bitbucket:username/repo` for a Bitbucket repo and `username/repo#branch` for tags or branches.

### Local Templates

Instead of a GitHub repo, you can also use a template on your local file system:

``` bash
mv path/to/yourTemplate ~/.my-templates
my init yourTemplate my-project
```

### Writing Custom Templates from Scratch

- A template repo **must** have a `template` directory that holds the template files.

- A template repo **may** have a metadata file for the template which can be either a `meta.js` or `meta.json` file. It can contain the following fields:

  - `prompts`: used to collect user options data;

  - `filters`: used to conditional filter files to interpolate.

  - `skipRender`: used to conditional filter files to render.

  - `completeMessage`: the message to be displayed to the user when the template has been generated. You can include custom instruction here.

  - `complete`: Instead of using `completeMessage`, you can use a function to run stuffs when the template has been generated.

#### prompts

The `prompts` field in the metadata file should be an object hash containing prompts for the user. For each entry, the key is the variable name and the value is an [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question). Example:

``` json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

After all prompts are finished, all files inside `template` will be rendered using [Handlebars](http://handlebarsjs.com/), with the prompt results as the data.

##### Conditional Prompts

A prompt can be made conditional by adding a `when` field, which should be a JavaScript function evaluated with data collected from previous prompts. For example:

``` js
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "Use a linter?"
    },
    "lintConfig": {
      "when": anwsers => anwsers.lint,
      "type": "list",
      "message": "Pick a lint config",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

The prompt for `lintConfig` will only be triggered when the user answered yes to the `lint` prompt.

##### Pre-registered Handlebars Helpers

Two commonly used Handlebars helpers, `if_eq` and `unless_eq` are pre-registered:

``` handlebars
{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
```

##### Custom Handlebars Helpers

You may want to register additional Handlebars helpers using the `helpers` property in the metadata file. The object key is the helper name:

``` js
module.exports = {
  helpers: {
    lowercase: str => str.toLowerCase()
  }
}
```

Upon registration, they can be used as follows:

``` handlebars
{{ lowercase name }}
```

#### File filters

The `filters` field in the metadata file should be an object hash containing file filtering rules. For each entry, the key is a [minimatch glob pattern](https://github.com/isaacs/minimatch) and the value is a JavaScript function passed in the prompt answers data. Example:

``` js
{
  filters: {
    "test/**/*": opts => opts.needTests
  }
}
```

Files under `test` will only be generated if the user answered yes to the prompt for `needTests`.

Note that the `dot` option for minimatch is set to `true` so glob patterns would also match dotfiles by default.

#### Skip rendering

The `skipRender` field in the metadata file should be a [minimatch glob pattern](https://github.com/isaacs/minimatch). The files matched should skip rendering. Example:

``` json
{
  "skipRender": "src/**/*.vue"
}
```


#### Additional data available in meta.{js,json}

- `destDirName` - destination directory name

```json
{
  "completeMessage": "To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev"
}
```

- `inPlace` - generating template into current directory

```json
{
  "completeMessage": "{{#inPlace}}To get started:\n\n  npm install\n  npm run dev.{{else}}To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev.{{/inPlace}}"
}
```

### `complete` function

Arguments:

- `data`: the same data you can access in `completeMessage`:
  ```js
  {
    complete ({inPlace, destDirName}) {
      if (!inPlace) {
        console.log(`cd ${destDirName}`)
      }
    }
  }
  ```


_Note_: The surrounding quotes are necessary on zsh shells because of the special meaning of the `#` character.
