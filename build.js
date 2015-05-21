/*//====//====//====//
    JavaScript pre compiler script for node.js
    Written by Iain Shorter on 19th May 2015
    MIT License
//====//====//====//*/

var fs = require('fs');

var buildfiles = {
	'src/Doom.js' : 'build/Doom.js'
};

var precompile = (function(){
    
    var definitions = {};
    var bLocked = false;
    var output = [];
    var activeFile;
    var activeLine;

    var main = {
        import: function( filename ){
            
            if( !bLocked ){
				try{
					var filebuffer = fs.readFileSync( filename );

					buildLog("Importing \""+filename+"\" into \""+activeFile+"\"");

					if( filebuffer ){
						readFile( filebuffer, filename );
					}
				}catch(e){
					buildLog("Failed to import \""+filename+"\" into \""+activeFile+"\"");
				}
            }
        },
        
        insert: function( key ){
            if( !bLocked ){
                output.push( 'var '+key+' = '+JSON.stringify(definitions[key])+';' );
                buildLog("Inserting definition \""+key+"\" into script");
            }
        },
        
        comment: function( key ){
            if( !bLocked ){
                output.push( definitions[key] );
                buildLog("Inserting definition as commment \""+key+"\" into script");
            }
        },

        define: function( key, value ){
            if( !bLocked ){
                definitions[key] = value;
                buildLog("Defining \""+key+"\" as \""+value+"\"");
            }
            
        },
		
		console: function( key, value ){
			if( !bLocked ){
                output.push( "console."+key+"( "+value+" );" );
                buildLog("Adding console output \""+key+"\" as \""+value+"\"");
            }
		},

        if: function( key, value ){
            if( !bLocked ){
                if(definitions[key] !== value){
                    buildLog("Skipping conditional block");
                    bLocked = key;
                }else{
                    buildLog("Inserting conditional block into script");
                }
            }
        },

        ifn: function( key, value ){
            if( !bLocked ){
                if(definitions[key] === value){
                    buildLog("Skipping conditional block");
                    bLocked = key;
                }else{
                    buildLog("Inserting conditional block into script");
                }
            }
        },

        endif: function( key ){
            if( key === bLocked ){
                bLocked = false;
            }
        }
    }
    
    function buildLog(text){
        console.log("["+new Date().toTimeString().split(' ')[0]+"] "+activeFile+" Line:"+activeLine+" ---- "+text); 
    }
    
    function readFile( contents, name ){
        var lines = contents.toString().split('\n');
        var i;
        var l;
        
        for( i = 0, l = lines.length; i < l; i++ ){
            activeLine = i+1;
            activeFile = name;
            readLine( lines[i] );
        }
    }
    
    function readLine( line ){
        if( line.trim().indexOf('// @') === 0 ){ //special line
            var chunks = line.trim().substr(4).split(' ');
            
            if( main[chunks[0]]){
                main[chunks[0]]( 
                    chunks[1] || '',
                    JSON.parse( chunks.splice(0,2) && chunks.join(' ') || 'false')
                );
            }
        }else{ //boring line
            if( !bLocked )
                output.push( line );
        }
    }

    return function compile( file ){
        var filebuffer = fs.readFileSync(file);
        definitions = {};
        bLocked = false;
        output.length = 0;
        readFile( filebuffer.toString('utf8'), file );
        return new Buffer(output.join('\n'));
    }
    
}());

(function(){
	for(var key in buildfiles){
		try{
			fs.writeFileSync( buildfiles[key], precompile(key) );	
		}catch(e){
			buildLog("Failed to compile \""+key+"\"");
			console.log(e);
		}
	}
}());