출처 : https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l
---
title: "Xdebug in VSCode with Docker" # Title of the blog post.
date: 2022-09-26T14:31:09+09:00 # Date of post creation.
description: "Xdebug in VSCode with Docker " # Description used for search engine.
featured: false # Sets if post is a featured post, making appear on the home page side bar.
draft: true # Sets whether to render this page. Draft of true will not be rendered.
toc: true # Controls if a table of contents should be generated for first-level links automatically.
# menu: main

[//]: # (featureImage: "/images/path/file.jpg" # Sets featured image on blog post.)

[//]: # (thumbnail: "/images/path/thumbnail.png" # Sets thumbnail image appearing inside card on homepage.)

[//]: # (shareImage: "/images/path/share.png" # Designate a separate image for social media sharing.)
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

[//]: # (  serises:)

[//]: # (- Serises)
# comment: false # Disable comment if false.
---
[![잭 미라스](https://res.cloudinary.com/practicaldev/image/fetch/s--NlLZrqVr--/c_fill,f_auto,fl_progressive,h_50,q_auto,w_50/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/196978/8abb8c25-1a2e-4f08-bcfc-4799fabe86b0.jpeg)](https://dev.to/jackmiras)

[잭 미라스](https://dev.to/jackmiras)

게시일2021년 12월 10일 • 업데이트 날짜1월 29일


지난 포스팅에서 [개발](https://dev.to/jackmiras/docker-compose-for-a-laravel-app-ie7) 환경을 구성하는 방법과 프로덕션용으로 만들어진 Dockerfile을 확장하는 방법에 대해 이야기했습니다.

이제 Xdebug가 Docker에서 직접 실행되고 Visual Studio Code와 연결할 수 있는 방식으로 이전 Dockerfile을 기반으로 빌드하는 방법을 공유하고 싶습니다.

이 접근 방식을 선택함으로써 우리는 각 팀 구성원이 프로젝트를 시작하고 실행하기 위해 컴퓨터에서 수행해야 하는 설정의 양을 상당히 줄여서 코드 작성을 더 빨리 시작할 수 있습니다.

이것이 왜 그렇게 중요한가? [JetBrains](https://www.jetbrains.com/lp/devecosystem-2021/php/#PHP_how-do-you-usually-debug-php-code) 의 최근 연구 에 따르면 PHP 개발자의 68%가 var\_dump(), die(), dd() 및 dump()를 사용하여 코드를 디버그합니다. 내 관점에서 볼 때 잘못된 것은 없습니다. 지식이 부족해서가 아니라 선택으로 한다고 해도.

저는 Xdebug와 같은 완전한 기능을 갖춘 디버그 솔루션을 사용하는 대신 보조 기능을 사용하여 코드를 디버깅하는 개발자의 68%에 포함됩니다. 지식이 부족해서가 아니라 내가 Neovim을 많이 사용하고 Xdebug와 함께 Neovim을 사용하여 잘 적응하지 않았기 때문에 dd() 함수 주변에서 내 코드 조각을 사용하는 것이 더 쉽고 빠릅니다.

그러나 때때로 저는 Visual Studio Code로 뛰어들어 Xdebug를 사용하는 것이 더 빠를 것 같은 상황에 놓였습니다. 특히 Vim/Neovim에 익숙하지 않은 다른 사람들과 작업할 때 그렇습니다.

### [](https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l#content)콘텐츠

[//]: # (- [XDebug 설정 파일]&#40;https://dev.to/jackmiras/xdebug-in-vscode-with-docker-379l#xdebug-config-file&#41;)

[//]: # (    - [xdebug.ini 설명]&#40;https:/#explaining-xdebug.ini&#41;)

[//]: # (- [비주얼 스튜디오 코드]&#40;https://dev.tovscode/&#41;)

[//]: # (    - [launch.json 설명]&#40;https:/#explaining-launch.json&#41;)

### Xdebug config file

PhpStorm을 시작하기 전에 먼저 Xdebug에 대한 몇 가지 사항을 지워서 IDE에서 수행할 변경 사항을 완전히 파악해야 합니다. 이 정보는 이전 게시물에서 [명령 지시문](https://dev.to/jackmiras/docker-compose-for-a-laravel-app-ie7#app-command-directive) 에 대한 주제에 대해 처음 소개되었습니다 . 어떤 시점에서 xdebug.ini 파일이 로컬 .docker 폴더에서 컨테이너의 /etc/php8/conf.d/50\_xdebug.ini로 복사되는 것을 알 수 있습니다.

Even though the content of the file got shown, I intentionally didn't explain its content so that we could explore the debugging topic all at once, going all the way from configuring Xdebug to using it with an IDE.

Down below, we have the same Xdebug config file, from the previous post, placed at .docker/xdebug.ini on the root of our Laravel project. Each line of code will be explained further, but in case you want to know every configuration that you can add in this file, check the [Xdebug documentation](https://xdebug.org/docs/all_settings).

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

Enter fullscreen mode Exit fullscreen mode

##### Explaining xdebug.ini

- zend\_extension=xdebug.so

A Zend extension hooks into “lower level” languages, a single extension can be both a PHP and a Zend extension, despite being very uncommon it's possible and Xdebug is a good example of it.

- xdebug.mode=develop,coverage,debug,profile

This setting controls which Xdebug features got enabled, according to the documentation the following values gets accepted:

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

Enter fullscreen mode Exit fullscreen mode

- xdebug.idekey=docker

Controls which IDE Key Xdebug should pass on to the debugging client or proxy. The IDE Key is only important for use with the DBGp Proxy Tool, although some IDEs are incorrectly picky as to what its value is. The default is based on the DBGP\_IDEKEY environment setting. If it is not present, the default falls back to an empty string.

- xdebug.start\_with\_request=yes

The functionality starts when the PHP request starts, and before any PHP code getting executed. For example, xdebug.mode=trace and xdebug.start\_with\_request=yes starts a Function Trace for the whole request.

- xdebug.log=/dev/stdout

Configure Xdebug's log file, but in here, we are redirecting the log content to the default stdout of our container.

> In case you don't want to see these logs you can comment out this line of your **.docker/xdebug.ini** file by changing the line to `;xdebug.log=/dev/stdout`.

- xdebug.log\_level=0

Configures which logging messages should be added to the log file. In here we are instructing Xdebug to log only errors in the configuration, in case you want to see more information you can use the level 7 for log info or the level 10 for log debug.

- xdebug.client\_port=9003

The port to which Xdebug tries to connect on the remote host. Port 9003 is the default for both Xdebug and the Command Line Debug Client. As many clients use this port number, it is best to leave this setting unchanged.

- xdebug.client\_host=<YOUR\_COMPUTER\_IP>

Configures the IP address or hostname where Xdebug will attempt to connect to when initiating a debugging connection. This address should be the address of the machine where your IDE or debugging client is listening for incoming debugging connections.

Down below, you can see how to correctly get your IP address in the main OS developers use. In case you are using a different OS, the commands may serve you as base to try to extrapolate a solution for your use case.

macOS:

```
ipconfig getifaddr en0
```

Enter fullscreen mode Exit fullscreen mode

Windows with WSL:

```command
grep nameserver /etc/resolv.conf | cut -d ' ' -f2
```

Enter fullscreen mode Exit fullscreen mode

Linux (Debian based distros):

```shell
hostname -I | cut -d ' ' -f1
```

Enter fullscreen mode Exit fullscreen mode

Once you correctly found your IP address, you can place him into the xdebug.client\_host as mentioned before, and that will leave you with a directive looking similar to this xdebug.client\_host=192.168.0.158.

In summary, you've instructed Xdebug to start from a request and try to send the debug events to the host with the IP 192.168.0.158 on the port 9003. Since the IP represents your computer, these means that when configuring Visual Studio Code to connect into Xdebug, the configuration will be extremely similar to when connecting to the localhost.

### Visual Studio Code

As you may already know, Visual Studio Code or, VSCode for short, is a source-code editor made by Microsoft for Windows, Linux, and macOS. Features include support for debugging, syntax highlighting, intelligent code completion, snippets, code refactoring, and embedded Git.

With that being said, you may be wondering… what do we need to have VSCode with all the aspects of an IDE with full-featured debug?

For starters, we will need to install the [PHP Debug](https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug) plugin from Felix Becker:

[![install-php-debug-plugin](https://res.cloudinary.com/practicaldev/image/fetch/s--_BUfn8IY--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rz3bku4a3g3qhy0evqjm.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--_BUfn8IY--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/rz3bku4a3g3qhy0evqjm.png)

Thereafter, a file called launch.json have to be generated, this file gets used by the debugger in any language, which means that a part of this process can be reused when configuring the debugger on VSCode for other languages.

You can generate the file by clicking in _Run and Debug > create a launch.json file > Docker: Debug in Container_, as the following screenshot shows:

[![설정 디버그](https://res.cloudinary.com/practicaldev/image/fetch/s--9I67c-kx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84a6bxw68hsue3oszlrz.png)](https://res.cloudinary.com/practicaldev/image/fetch/s--9I67c-kx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/84a6bxw68hsue3oszlrz.png)

Finally, the **launch.json** file will be created with a specification of `version` and an empty `configurations` array, just like the next screenshot shows:

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

Enter fullscreen mode Exit fullscreen mode

#### launch.json

- name

Indicates the name given to a configuration object.

- type

Indicates the underlying debugger getting used.

- request

Indicates whether the configuration is intended to _launch_ the program or _attach_ to an already running instance.

- port

Indicates the port on which to listen for Xdebug

- pathMappings

Indicates a mapping of server paths to local paths.

> When using /var/www/html/ as key, VSCode knows that the files at the container are under that path, and by using the ${workspaceFolder} as value, VSCode knows that locally the project files are under the current opened directory.

* * *

I encourage you to leave this launch.json file with its content in the project, so other team members can just clone the project, run the containers and enjoy a full-featured debug solution running in a container environment.

Happy coding!
