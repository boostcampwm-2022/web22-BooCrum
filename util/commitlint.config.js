module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    // 스코프는 컨벤션과 맞지 않기에, 사용하지 않는 것으로 한다.
    'scope-empty': [2,'always'],
    // 헤더의 길이는 50자로 제한한다.
    'header-max-length': [2, 'always', 50],
    // 본문의 한 줄은 72자로 제한한다. 
    'body-max-line-length': [2, 'always', 72],
    // 타입은 아래의 태그만 사용하도록 한다.
    'type-enum': [2, 'always', ['feat','fix','refactor','style','docs','test','chore']],
    // 이슈 번호로 종료되는지, .으로 끝나지 않는지 확인한다.
    // fe, be로 시작하는지 확인
    // 제목이 한글인지 확인
    'subject-full-stop': [0],
    'function-rules/subject-full-stop': [
      2,
      'always',
      ({ subject, header, body, raw })=>{

        // 1. 이슈 번호로 종료되는가?
        if (subject && !/[^\.] #[0-9]+$/.test(subject))
          return [false, 'subject는 issue 번호를 #[number] 형식으로 끝에 포함해야하며, .(점) 으로 끝나지 말아야 합니다.'];
        
        // 2. FE / BE 로 시작하는가?
        if (subject && !/^(fe|be) ?- ?/.test(subject.trim()))
          return [false, 'subject는 "FE - " 혹은 "BE - "로 시작해야 합니다.'];

        // 3. 제목이 한글로 작성되었는가?
        // if (!/[a-z]+/i.test(subject.trim()))
        //   return [false, '제목(subject)은 한글로 작성해주십시오. 부득이한 경우 담당자에게 문의 바랍니다.'];
        
        // 4. 제목과 바디가 공백으로 분리되어있는가?
        if (body && raw && header && raw.search('\n\n') !== header.length)
          return [false, '제목과 본문은 공백으로 구분해주시기 바랍니다.'];
        
        return [true];
    }],
    'body-leading-blank': [0],
    'function-rules/body-leading-blank': [
      2,
      'always',
      ({ body })=>{
        // body가 없으면 굳이 판단하지 않는다.
        if (!body)
          return [true];
        if (body.split('\n').filter(line=>!/ *-/.test(line)).length > 0)
          return [false, '본문의 각 줄은 - 으로 시작해야 합니다.'];
        return [true];
      }
    ],
  },
}