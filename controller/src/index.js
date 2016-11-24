import _ from 'lodash';


export function outcome(question, session, env) {

  session.value = session.value || [];
  return new Promise((resolve, reject) => {
    if (!question || !question.correctResponse || _.isEmpty(question.correctResponse)) {
      reject(new Error('Question is missing required array: correctResponse'));
    } else {
      const allCorrect = true; //is it?
      resolve({
        score: {
          scaled: allCorrect ? 1 : 0
        }
      });
    }
  });

}

export function model(question, session, env) {
  console.debug('[state] question:', JSON.stringify(question, null, '  '));
  console.debug('[state] session:', JSON.stringify(session, null, '  '));
  console.debug('[state] env:', JSON.stringify(env, null, '  '));

  var base = _.assign({}, _.cloneDeep(question.model));
  base.outcomes = [];

  if (env.mode !== 'gather') {
    base.disabled = true;
  }

  if (env.mode === 'evaluate') {
  }

  base.env = env;

  var map = {
    black_on_rose: 'black-on-rose',
    white_on_black: 'white-on-black',
    black_on_white: 'default'
  };

  if (env.accessibility && env.accessibility.colorContrast && map[env.accessibility.colorContrast]){
    base.className = map[env.accessibility.colorContrast];
  }

  console.debug('[state] return: ' + JSON.stringify(base, null, '  '));
  return Promise.resolve(base);
}