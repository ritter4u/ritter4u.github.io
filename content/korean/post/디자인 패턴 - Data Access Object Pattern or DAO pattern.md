
___
Data Access Object Pattern 또는 DAO 패턴은 낮은 수준의 데이터 액세스 API 또는 작업을 높은 수준의 비즈니스 서비스와 분리하는 데 사용됩니다. 다음은 Data Access Object Pattern의 참여자입니다.

- **데이터 액세스 개체 인터페이스** - 이 인터페이스는 모델 개체에서 수행할 표준 작업을 정의합니다.
    
- **Data Access Object 구체 클래스** - 이 클래스는 위의 인터페이스를 구현합니다. 이 클래스는 데이터베이스/xml 또는 기타 저장 메커니즘이 될 수 있는 데이터 소스에서 데이터를 가져오는 역할을 합니다.
    
- **모델 개체 또는 값 개체** - 이 개체는 DAO 클래스를 사용하여 검색된 데이터를 저장하기 위한 get/set 메서드를 포함하는 간단한 POJO입니다.
    

## 구현

모델 또는 값 개체로 작동하는 _Student_ 개체를 만들 것입니다. _StudentDao_는 데이터 액세스 개체 인터페이스입니다. _StudentDaoImpl_은 데이터 액세스 개체 인터페이스를 구현하는 구체적인 클래스입니다. 데모 클래스인 _DaoPatternDemo_는 _StudentDao_를 사용하여 데이터 액세스 개체 패턴의 사용을 보여줍니다.

![데이터 접근 객체 패턴 UML 다이어그램](https://www.tutorialspoint.com/design_pattern/images/dao_pattern_uml_diagram.jpg)

## 1 단계

값 개체를 만듭니다.

_학생.자바_

```
공개 수업 학생 {
   개인 문자열 이름;
   개인 int 롤 아니요;

   학생(문자열 이름, int 롤 번호){
      this.name = 이름;
      this.rollNo = 롤번호;
   }

   공개 문자열 getName() {
      반환 이름;
   }

   공개 무효 setName(문자열 이름) {
      this.name = 이름;
   }

   공개 int getRollNo() {
      반환 롤 아니요;
   }

   공개 무효 setRollNo(int rollNo) {
      this.rollNo = 롤번호;
   }
}
```

## 2 단계

데이터 액세스 개체 인터페이스를 만듭니다.

_학생다오.java_

```
가져오기 java.util.List;

공개 인터페이스 StudentDao {
   공개 목록<학생> getAllStudents();
   공개 학생 getStudent(int rollNo);
   public void updateStudent(학생);
   public void deleteStudent(학생);
}

```

## 3단계

위의 인터페이스를 구현하는 구체적인 클래스를 만듭니다.

_StudentDaoImpl.java_

```
가져오기 java.util.ArrayList;
가져오기 java.util.List;

공개 클래스 StudentDaoImpl은 StudentDao {를 구현합니다.

   //목록이 데이터베이스로 작동 중입니다.
   목록<학생> 학생;

   공개 StudentDaoImpl(){
      학생 = 새로운 ArrayList<학생>();
      학생 student1 = new Student("Robert",0);
      학생 student2 = new Student("John",1);
      학생.추가(학생1);
      학생.추가(학생2);
   }
   @우세하다
   public void deleteStudent(학생 학생) {
      학생.제거(학생.getRollNo());
      System.out.println("학생: 롤 번호 " + student.getRollNo() + ", 데이터베이스에서 삭제됨");
   }

   // 데이터베이스에서 학생 목록 검색
   @우세하다
   공개 목록<학생> getAllStudents() {
      재학생;
   }

   @우세하다
   공개 학생 getStudent(int rollNo) {
      학생을 반환합니다.get(rollNo);
   }

   @우세하다
   public void updateStudent(학생 학생) {
      학생.get(학생.getRollNo()).setName(학생.getName());
      System.out.println("학생: 롤 번호 " + student.getRollNo() + ", 데이터베이스에서 업데이트됨");
   }
}
```

## 4단계

_StudentDao_를 사용하여 데이터 액세스 개체 패턴 사용을 보여줍니다.

_DaoPatternDemo.java_

```
공개 클래스 DaoPatternDemo {
   공개 정적 무효 메인(문자열[] 인수) {
      StudentDao studentDao = new StudentDaoImpl();

      //모든 학생 출력
      (학생 학생 : studentDao.getAllStudents()) {
         System.out.println("학생: [RollNo: " + student.getRollNo() + ", 이름: " + student.getName() + " ]");
      }


      //학생 업데이트
      학생 학생 =studentDao.getAllStudents().get(0);
      학생.setName("마이클");
      StudentDao.updateStudent(학생);

      //학생 가져오기
      학생다오.getStudent(0);
      System.out.println("학생: [RollNo: " + student.getRollNo() + ", 이름: " + student.getName() + " ]");
   }
}
```

## 5단계

출력을 확인합니다.

```
학생: [롤번호: 0, 이름: 로버트]
학생: [롤번호 : 1, 이름 : John ]
학생: 롤 번호 0, 데이터베이스에서 업데이트됨
학생: [롤번호 : 0, 이름 : Michael ]

```