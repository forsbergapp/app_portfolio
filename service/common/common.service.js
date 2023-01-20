
//ES6 object with properties using concise method syntax
const COMMON = {
    app_filename(module){
        let from_app_root = ('file:///' + process.cwd().replace(/\\/g, '/')).length;
        return module.substring(from_app_root);
    },
    app_function(stack){
        let e = stack.split("at ");
        let functionName;
        //loop from last to first
        //ES6 rest parameter to avoid mutating array
        for (let line of [...e].reverse()) {
            //ES6 startsWith and includes
            if ((line.startsWith('file')==false && 
                line.includes('node_modules')==false &&
                line.includes('node:internal')==false &&
                line.startsWith('Query')==false)||
                line.startsWith('router')){
                    functionName = line.split(" ")[0];
                    break;
            }
        }
        return functionName;
    },
    app_line(){
        let e = new Error();
        let frame = e.stack.split("\n")[2];
        let lineNumber = frame.split(":").reverse()[1];
        return lineNumber;
    }
};
export{COMMON};