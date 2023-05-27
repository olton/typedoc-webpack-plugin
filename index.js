const typedoc = require('typedoc');
const clone = require('lodash.clone');
const path = require('path');

class TypedocWebpackPlugin {
    static name = "TypedocWebpackPlugin"
    static defaultOptions = {
    }
    constructor(options) {
        this.startTime = Date.now();
        this.prevTimestamps = {};

        this.options = {...TypedocWebpackPlugin.defaultOptions, ...options}

        if (!this.options.out && !this.options.json) {
            this.options.out = "./docs"
        }
    }

    apply(compiler){
        compiler.hooks.emit.tapAsync(
            TypedocWebpackPlugin.name,
            async (
                compilation,
                callback
            ) => {
                let changedFiles = !compilation.fileTimestamps ? [] : Array.from(compilation.fileTimestamps.keys()).filter(
                    (watchfile) => {
                        return (
                            (this.prevTimestamps.get(watchfile) || this.startTime) <
                            (compilation.fileTimestamps.get(watchfile) || Infinity)
                        );
                    }
                );

                let tsFileEdited = false;
                for (let i = 0; i < changedFiles.length; i++) {
                    if (changedFiles[i].indexOf('.ts') > -1) {
                        tsFileEdited = true;
                        break;
                    }
                }

                if (tsFileEdited || changedFiles.length === 0) {
                    const typedocOptions = clone(this.options);

                    if (this.options.json) {
                        if (path.isAbsolute(this.options.json)) {
                            typedocOptions.json = this.options.json;
                        } else if (compiler.options.output && compiler.options.output.path) {
                            typedocOptions.json = path.join(compiler.options.output.path, this.options.json);
                        }
                    } else {
                        if (path.isAbsolute(this.options.out)) {
                            typedocOptions.out = this.options.out;
                        } else if (compiler.options.output && compiler.options.output.path) {
                            typedocOptions.out = path.join(compiler.options.output.path, this.options.out);
                        }
                    }

                    const app = new typedoc.Application()

                    app.options.addReader(new typedoc.TypeDocReader());
                    app.options.addReader(new typedoc.PackageJsonReader());
                    app.options.addReader(new typedoc.TSConfigReader());

                    await app.bootstrap(typedocOptions)

                    const proj = app.convert()

                    if (!proj) {
                        throw Error("Compiler error!")
                    }

                    app.validate(proj)

                    if (!typedocOptions.json || typedocOptions.out) {
                        await app.generateDocs(proj, typedocOptions.out)
                    }
                    if (typedocOptions.json) {
                        await app.generateJson(proj, typedocOptions.json)
                    }
                } else {
                    console.log('No ts filed changed. Not recompling typedocs');
                }

                this.prevTimestamps = compilation.fileTimestamps;
                callback();
            }
        )

        compiler.hooks.done.tap(
            TypedocWebpackPlugin.name,
            (
                stats
            ) => {
                console.log('Typedoc finished generating')
            }
        )
    }
}

module.exports = TypedocWebpackPlugin