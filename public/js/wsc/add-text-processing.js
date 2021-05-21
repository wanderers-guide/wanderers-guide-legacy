/* Copyright (C) 2021, Wanderer's Guide, all rights reserved.
    By Aaron Cassar.
*/

function processAddText(code, locationID, centerText=false){
  if(code == null || locationID == null) {return;}

  let allStatements = code.split(/\n/);
  for(let statementRaw of allStatements){
    if(statementRaw.includes("ADD-TEXT=")){ // ADD-TEXT=Anything, will be parsed like a description field

      let statement = null;

      if(typeof testExpr == "function"){

        // Test/Check Statement for Expressions //
        statement = testExpr(statementRaw);
        if(statement === null) {continue;}
        if(!statement.includes("ADD-TEXT=")){continue;}
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

        let text = statement.split('=')[1];
        let centerStyle = '';
        if(centerText) { centerStyle = 'has-text-center-justified'; }
        $('#'+locationID).append('<div class="py-1 '+centerStyle+'">'+processText(text, false, true, 'MEDIUM')+'</div>');

      } else {

        const exprData = readExpr(statementRaw);

        let expression = exprData.expression;
        expression = expression.replace(/-/g, ' ');
        expression = expression.replace(/\s*==\s*/g, ' equal to ');
        expression = expression.replace(/\s*!=\s*/g, ' not equal to ');
        expression = expression.replace(/\s*>=\s*/g, ' greater than or equal to ');
        expression = expression.replace(/\s*<=\s*/g, ' lesser than or equal to ');
        expression = expression.replace(/\s*&&\s*/g, ' and ');
        
        if (exprData.statement != null && exprData.statement.includes("ADD-TEXT=")){
          statement = exprData.statement;
          expression = 'If '+expression;
        } else if(exprData.elseStatement != null && exprData.elseStatement.includes("ADD-TEXT=")){
          statement = exprData.elseStatement;
          expression = 'If not '+expression;
        }

        let text = statement.split('=')[1];
        let centerStyle = '';
        if(centerText) { centerStyle = 'has-text-center-justified'; }

        $('#'+locationID).append(`
          <div class="box">
            <p class="is-size-5-5 is-bold">${capitalizeWord(expression)}:</p>
            <hr class="mt-1 mb-2">
            <div class="py-1 ${centerStyle}">${processText(text, false, true, 'MEDIUM')}</div>
          </div>
        `);

      }

      if(centerText) {
        $('#'+locationID).find('.has-text-left').removeClass('has-text-left');
      }

    }
  }

}