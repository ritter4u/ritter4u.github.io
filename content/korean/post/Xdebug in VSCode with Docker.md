---
title: "Xdebug in VSCode with Docker" # Title of the blog post.
date: 2022-09-30T14:31:09+09:00 # Date of post creation.
description: "Xdebug in VSCode with Docker " # Description used for search engine.
featured: false # Sets if post is a featured post, making appear on the home page side bar.
draft: false # Sets whether to render this page. Draft of true will not be rendered.
toc: true # Controls if a table of contents should be generated for first-level links automatically.
# menu: main
# featureImage: "/images/path/file.jpg" # Sets featured image on blog post.
# thumbnail: "/images/path/thumbnail.png" # Sets thumbnail image appearing inside card on homepage.
# shareImage: "/images/path/share.png" # Designate a separate image for social media sharing.

codeMaxLines: 10 # Override global value for how many lines within a code block before auto-collapsing.
codeLineNumbers: true # Override global value for showing of line numbers within code block.
figurePositionShow: false # Override global value for showing the figure label.
categories:
- Programming
  tags:
- Tip
- PHP
- Xdebug
- VSCode
- Docker
# serises:
# - Serises
# comment: false # Disable comment if false.
---
출처 : https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l

[잭 미라스](https://dev.to/jackmiras)

게시일2021년 12월 10일 • 업데이트 날짜1월 29일


지난 포스팅에서 [개발](https://dev.to/jackmiras/docker-compose-for-a-laravel-app-ie7) 환경을 구성하는 방법과 프로덕션용으로 만들어진 Dockerfile을 확장하는 방법에 대해 이야기했습니다.

이제 Xdebug가 Docker에서 직접 실행되고 Visual Studio Code와 연결할 수 있는 방식으로 이전 Dockerfile을 기반으로 빌드하는 방법을 공유하고 싶습니다.

이 접근 방식을 선택함으로써 우리는 각 팀 구성원이 프로젝트를 시작하고 실행하기 위해 컴퓨터에서 수행해야 하는 설정의 양을 상당히 줄여서 코드 작성을 더 빨리 시작할 수 있습니다.

이것이 왜 그렇게 중요한가? [JetBrains](https://www.jetbrains.com/lp/devecosystem-2021/php/#PHP_how-do-you-usually-debug-php-code) 의 최근 연구 에 따르면 PHP 개발자의 68%가 var\_dump(), die(), dd() 및 dump()를 사용하여 코드를 디버그합니다. 내 관점에서 볼 때 잘못된 것은 없습니다. 지식이 부족해서가 아니라 선택으로 한다고 해도.

저는 Xdebug와 같은 완전한 기능을 갖춘 디버그 솔루션을 사용하는 대신 보조 기능을 사용하여 코드를 디버깅하는 개발자의 68%에 포함됩니다. 지식이 부족해서가 아니라 내가 Neovim을 많이 사용하고 Xdebug와 함께 Neovim을 사용하여 잘 적응하지 않았기 때문에 dd() 함수 주변에서 내 코드 조각을 사용하는 것이 더 쉽고 빠릅니다.

그러나 때때로 저는 Visual Studio Code로 뛰어들어 Xdebug를 사용하는 것이 더 빠를 것 같은 상황에 놓였습니다. 특히 Vim/Neovim에 익숙하지 않은 다른 사람들과 작업할 때 그렇습니다.

[//]: # (### []&#40;https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l#content&#41;콘텐츠)

[//]: # (- [XDebug 설정 파일]&#40;https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l#xdebug-config-file&#41;)

[//]: # (    - [xdebug.ini 설명]&#40;https:/#explaining-xdebug.ini&#41;)

[//]: # (- [비주얼 스튜디오 코드]&#40;https://dev.tovscode/&#41;)

[//]: # (    - [launch.json 설명]&#40;https:/#explaining-launch.json&#41;)

### Xdebug config file

PhpStorm을 시작하기 전에 먼저 Xdebug에 대한 몇 가지 사항을 지워서 IDE에서 수행할 변경 사항을 완전히 파악해야 합니다. 이 정보는 이전 게시물에서 [명령 지시문](https://dev.to/jackmiras/docker-compose-for-a-laravel-app-ie7#app-command-directive) 에 대한 주제에 대해 처음 소개되었습니다 . 어떤 시점에서 xdebug.ini 파일이 로컬 .docker 폴더에서 컨테이너의 /etc/php8/conf.d/50\_xdebug.ini로 복사되는 것을 알 수 있습니다.

비록 파일 내용이 보여지긴 했지만, Xdebug 설정부터 IDE와 함께 사용하는 방법까지 디버깅 주제를 한 번에 살펴보기 위해 일부러 내용을 설명하지 않았습니다.

아래에는 Laravel 프로젝트 루트의 .docker/xdebug.ini에 있는 이전 게시물과 동일한 Xdebug 구성 파일이 있습니다. 각 코드 줄에 대해 자세히 설명하지만 이 파일에 추가할 수 있는 모든 구성을 알고 싶다면 [Xdebug 문서](https://xdebug.org/docs/all_settings)를 확인하세요.
```ini
zend_extension=xdebug.so
xdebug.mode=develop,coverage,debug,profile
xdebug.idekey=docker
xdebug.start_with_request=yes
xdebug.log=/dev/stdout
xdebug.log_level=0
xdebug.client_port=9003
xdebug.client_host=<YOUR_COMPUTER_IP>
```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

##### Explaining xdebug.ini

- zend\_extension=xdebug.so

Zend 확장은 "lower level" 언어에 연결되며, 단일 확장은 PHP와 Zend 확장 모두가 될 수 있습니다. 매우 드물기는 하지만 Xdebug가 좋은 예입니다.

- xdebug.mode=develop,coverage,debug,profile

이 설정은 다음 값이 허용되는 문서에 따라 활성화된 Xdebug 기능을 제어합니다.

```
- develop
    Enables Development Helpers, including the overloaded var_dump().
- coverage
    Enables Code Coverage Analysis to generate code coverage reports, mainly with PHPUnit.
- debug
    Enables Step Debugging. This can be used to step through your code while it is running, and analyze values of variables.
- profile
    Enables Profiling, with which you can analyze performance bottlenecks with tools like CacheGrind.
```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

- xdebug.idekey=docker

디버깅 클라이언트 또는 프록시에 전달해야 하는 IDE Key Xdebug를 제어합니다. IDE 키는 DBGp 프록시 도구와 함께 사용하는 경우에만 중요하지만 일부 IDE는 그 값에 대해 잘못 선택합니다. 기본값은 DBGP\_IDEKEY 환경 설정을 기반으로 합니다. 존재하지 않으면 기본값은 빈 문자열로 대체됩니다.

- xdebug.start\_with\_request=yes

이 기능은 PHP 요청이 시작될 때 PHP 코드가 실행되기 전에 시작됩니다. 예를 들어, xdebug.mode=trace 및 xdebug.start\_with\_request=yes는 전체 요청에 대한 함수 추적을 시작합니다.
- xdebug.log=/dev/stdout

Xdebug의 로그 파일을 구성하지만 여기에서는 로그 내용을 컨테이너의 기본 표준 출력으로 리디렉션합니다.

> 이 로그를 보고 싶지 않은 경우 행을 `;xdebug.log=/dev/stdout`으로 변경하여 **.docker/xdebug.ini** 파일의 이 행을 주석 처리할 수 있습니다.
- xdebug.log\_level=0

로그 파일에 추가해야 하는 로깅 메시지를 구성합니다. 여기에서 우리는 Xdebug가 구성의 오류만 기록하도록 지시하고 있습니다. 더 많은 정보를 보려면 로그 정보에 수준 7을 사용하거나 로그 디버그에 수준 10을 사용할 수 있습니다.

- xdebug.client\_port=9003

Xdebug가 원격 호스트에서 연결을 시도하는 포트입니다. 포트 9003은 Xdebug와 명령줄 디버그 클라이언트 모두의 기본값입니다. 많은 클라이언트가 이 포트 번호를 사용하므로 이 설정을 변경하지 않는 것이 가장 좋습니다.

- xdebug.client\_host=<YOUR\_COMPUTER\_IP>

디버깅 연결을 시작할 때 Xdebug가 연결을 시도할 IP 주소 또는 호스트 이름을 구성합니다. 이 주소는 IDE 또는 디버깅 클라이언트가 들어오는 디버깅 연결을 수신하는 컴퓨터의 주소여야 합니다.

아래에서 기본 OS 개발자가 사용하는 IP 주소를 올바르게 얻는 방법을 볼 수 있습니다. 다른 OS를 사용하는 경우 명령은 사용 사례에 대한 솔루션을 추정하기 위한 기반이 될 수 있습니다.
macOS:

```
ipconfig getifaddr en0
```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

Windows with WSL:

```command
grep nameserver /etc/resolv.conf | cut -d ' ' -f2
```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

Linux (Debian based distros):

```shell
hostname -I | cut -d ' ' -f1
```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

IP 주소를 올바르게 찾으면 앞에서 언급한 대로 xdebug.client\_host에 배치할 수 있습니다. 그러면 이 xdebug.client\_host=192.168.0.158과 유사한 지시문이 남게 됩니다.

요약하면, Xdebug에 요청에서 시작하고 포트 9003에서 IP 192.168.0.158을 사용하여 디버그 이벤트를 호스트로 보내도록 지시했습니다. IP는 컴퓨터를 나타내므로 Visual Studio Code를 다음과 같이 구성할 때 Xdebug에 연결하면 구성은 로컬 호스트에 연결할 때와 매우 유사합니다.

### Visual Studio Code

이미 알고 계시겠지만 Visual Studio Code 또는 VSCode는 Microsoft에서 Windows, Linux 및 macOS용으로 만든 소스 코드 편집기입니다. 기능에는 디버깅, 구문 강조 표시, 지능형 코드 완성, 스니펫, 코드 리팩토링 및 내장된 Git 지원이 포함됩니다.

그 말과 함께, 당신은 궁금해 할 것입니다... 완전한 기능을 갖춘 디버그가 있는 IDE의 모든 측면과 함께 VSCode가 있어야 하는 것은 무엇입니까?

우선 Felix Becker의 [PHP Debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) 플러그인을 설치해야 합니다.

[![install-php-debug-plugin](https://res.cloudinary.com/practicaldev/image/fetch/s--_BUfn8IY--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rz3bku4a3g3qhy0evqjm.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--_BUfn8IY--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rz3bku4a3g3qhy0evqjm.png)

그런 다음 launch.json이라는 파일을 생성해야 하며, 이 파일은 모든 언어의 디버거에서 사용됩니다. 즉, 다른 언어에 대해 VSCode에서 디버거를 구성할 때 이 프로세스의 일부를 재사용할 수 있습니다.

다음 스크린샷과 같이 _Run and Debug > create a launch.json file > Docker: Debug in Container_를 클릭하여 파일을 생성할 수 있습니다.

[![설정 디버그](https://res.cloudinary.com/practicaldev/image/fetch/s--9I67c-kx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84a6bxw68hsue3oszlrz.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--9I67c-kx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84a6bxw68hsue3oszlrz.png)

마지막으로 **launch.json** 파일은 다음 스크린샷과 같이 `version` 사양과 빈 `configurations` 배열로 생성됩니다.

[![debug-launch-json-without-configurations](https://res.cloudinary.com/practicaldev/image/fetch/s--zmf33iH9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4h3txx86nuyuugxnk3vv.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--zmf33iH9--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4h3txx86nuyuugxnk3vv.png)

Now, to properly configure the **launch.json** file you have to add in the `configurations` array an object with the properties name, type, request, port, and pathMappings which will leave you with a file looking like this:

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for XDebug on Docker",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "pathMappings": {
                "/var/www/html/": "${workspaceFolder}"
            }
        }
    ]
}

```

[//]: # (Enter fullscreen mode Exit fullscreen mode)

#### launch.json

- name

구성 개체에 지정된 이름을 나타냅니다.

- type

사용 중인 기본 디버거를 나타냅니다.

- request
-
구성이 프로그램을 _launch_할지 또는 이미 실행 중인 인스턴스에 _attach_할지 여부를 나타냅니다.

- port

Xdebug를 수신할 포트를 나타냅니다.

- pathMappings

로컬 경로에 대한 서버 경로 매핑을 나타냅니다.

> /var/www/html/을 키로 사용할 때 VSCode는 컨테이너의 파일이 해당 경로 아래에 있다는 것을 알고 ${workspaceFolder}를 값으로 사용하여 VSCode는 로컬에서 프로젝트 파일이 현재 열려 있는 디렉터리 아래에 있음을 알고 있습니다.
* * *

다른 팀 구성원이 프로젝트를 복제하고 컨테이너를 실행하며 컨테이너 환경에서 실행되는 모든 기능을 갖춘 디버그 솔루션을 즐길 수 있도록 이 launch.json 파일을 해당 콘텐츠와 함께 프로젝트에 남겨두는 것이 좋습니다.

Happy coding!
