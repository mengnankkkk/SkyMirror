function pathFilename(path) {
	var match = /\/([^\/]+)$/.exec(path);
	if (match) {
		return match[1];
	}
}

function getRandomInt(min, max) {
	// via https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Math/random#Examples
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(items) {
	return items[getRandomInt(0, items.length-1)];
}

var xkcd = {
	latest: null,
	last: null,
	cache: {},
	
	get: function(num, success, error) {
		if (num == null) {
			path = '';
		} else if (Number(num)) {
			path = String(num);
		} else {
			error(false);
			return false;
		}
		
		if (num in this.cache) {
			this.last = this.cache[num];
			success(this.cache[num]);
		} else {
			return false;
		}
	}
};

TerminalShell.commands['sudo'] = function(terminal) {
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift(); // terminal
	if (cmd_args.join(' ') == 'make me a sandwich') {
		terminal.print('Okay.');
	} else {
		var cmd_name = cmd_args.shift();
		cmd_args.unshift(terminal);
		cmd_args.push('sudo');
		if (TerminalShell.commands.hasOwnProperty(cmd_name)) {
			this.sudo = true;
			this.commands[cmd_name].apply(this, cmd_args);
			delete this.sudo;
		} else if (!cmd_name) {
			terminal.print('你想干嘛');
		} else {
			terminal.print('sudo: '+cmd_name+': command not found');
		}
	}
};

TerminalShell.filters.push(function (terminal, cmd) {
	if (/!!/.test(cmd)) {
		var newCommand = cmd.replace('!!', this.lastCommand);
		terminal.print(newCommand);
		return newCommand;
	} else {
		return cmd;
	}
});

TerminalShell.commands['shutdown'] = TerminalShell.commands['poweroff'] = function(terminal) {
	if (this.sudo) {
		terminal.print('由kunkun@SkyMirror发布的引力波广播');
		terminal.print();
		terminal.print('该系统已进入销毁序列');
		terminal.print('再见！');
		return $('#screen').fadeOut();
	} else {
		terminal.print('需要更高的权限');
	}
};

TerminalShell.commands['logout'] =
TerminalShell.commands['exit'] = 
TerminalShell.commands['quit'] = function(terminal) {
	terminal.print('再见');
	$('#prompt, #cursor').hide();
	terminal.promptActive = false;
};

TerminalShell.commands['restart'] = TerminalShell.commands['reboot'] = function(terminal) {
	if (this.sudo) {
		TerminalShell.commands['poweroff'](terminal).queue(function(next) {
			window.location.reload();
		});
	} else {
		terminal.print('需要更高的权限');
	}
};

function linkFile(url) {
	return {type:'dir', enter:function() {
		window.location = url;
	}};
}

Filesystem = {
	'welcome.txt': {type:'file', read:function(terminal) {
		terminal.print();
		terminal.print($('<h4>').text('~欢迎到访SkyMirror的命令行入口~'));
		terminal.print('使用"ls", "cat",以及"cd"到处探索吧');
		terminal.print('可以通过"help"指令获取更多帮助');
		terminal.print();
	}},
	'about.txt': {type:'file', read:function(terminal) {
		terminal.print();
		terminal.print($('<h4>').text('关于本站'));
		terminal.print();
		$.each([
			'这是SkyMirror的命令行首页',
			'SkyMirror是来自齐鲁工业大学的网络安全战队',
			'可以通过"cd book"指令进入我们的博客',
			'也可以通过"look"指令和"go"指令探索神秘的领域',
			''
		], function(num, line) {
			terminal.print(line);
		});
	}},
	'intro.txt': {type:'file', read:function(terminal) {
		terminal.print();
		terminal.print($('<h4>').text('关于CTF'));
		terminal.print();
		$.each([
			'CTF（Capture The Flag）中文一般译作夺旗赛，在网络安全领域中指的是网络安全技术人员之间进行技术竞技的一种比赛形式。',
			'参赛团队之间通过进行攻防对抗、程序分析等形式，率先从主办方给出的比赛环境中得到一串具有一定格式的字符串或其他内容，并将其提交给主办方，从而夺得分数',
			'CTF起源于1996年DEFCON全球黑客大会，以代替之前黑客们通过互相发起真实攻击进行技术比拼的方式。其已经成为全球范围网络安全圈流行的竞赛形式，2013年全球举办了超过五十场国际性CTF赛事。',
			'而DEFCON作为CTF赛制的发源地，DEFCON CTF也成为了全球最高技术水平和影响力的CTF竞赛，类似于CTF赛场中的“世界杯” 。',
			''
		], function(num, line) {
			terminal.print(line);
		});
	}},
	'score.txt': {type:'file', read:function(terminal) {
		terminal.print();
		terminal.print($('<h4>').text('战队成绩'));
		terminal.print();
		$.each([
			'2022ciscn   初赛全国第60名和第66名（赛区第7名和第9名） 复赛三等奖',
			'2022iscc   个人挑战赛&无限擂台赛 每位成员均获双项一等奖',
			'2022网刃杯   全国第28名',
			'*CTF 2022   全球第66名',
			'2022强网杯   全国第69名',
			'第七届美亚杯中国电子取证大赛 团体赛   全国一等奖',
			'第七届美亚杯中国电子取证大赛 资格赛   全国一等奖',
			'第十四届全国大学生信息安全竞赛   全国三等奖',
			'大学生网络安全尖峰训练营   精英百强',
			''
		], function(num, line) {
			terminal.print(line);
		});
	}},
	'contact.txt': {type:'file', read:function(terminal) {
		terminal.print();
		terminal.print($('<h4>').text('战队成绩'));
		terminal.print();
		$.each([
			'我们面向感兴趣的同学建立了QQ群：945059084',
			''
		], function(num, line) {
			terminal.print(line);
		});
	}},
};
Filesystem['book'] = linkFile('https://book.ctfer.club/');
Filesystem['wiki'] = linkFile('https://ctf-wiki.org/');
Filesystem['AboutMe'] = linkFile('https://book.ctfer.club/blog/post/admin/%E5%BC%80%E5%A7%8B%E7%9A%84%E5%BC%80%E5%A7%8B');
TerminalShell.pwd = Filesystem;

TerminalShell.commands['cd'] = function(terminal, path) {
	if (path in this.pwd) {
		if (this.pwd[path].type == 'dir') {
			this.pwd[path].enter(terminal);
		} else if (this.pwd[path].type == 'file') {
			terminal.print('cd: '+path+': Not a directory');
		}
	} else {
		terminal.print('cd: '+path+': No such file or directory');
	}
};

TerminalShell.commands['dir'] =
TerminalShell.commands['ls'] = function(terminal, path) {
	var name_list = $('<ul>');
	$.each(this.pwd, function(name, obj) {
		if (obj.type == 'dir') {
			name += '/';
		}
		name_list.append($('<li>').text(name));
	});
	terminal.print(name_list);
};

TerminalShell.commands['cat'] = function(terminal, path) {
	if (path in this.pwd) {
		if (this.pwd[path].type == 'file') {
			this.pwd[path].read(terminal);
		} else if (this.pwd[path].type == 'dir') {
			terminal.print('cat: '+path+': Is a directory');
		}
	} else if (pathFilename(path) == 'alt.txt') {
		terminal.setWorking(true);
		num = Number(path.match(/^\d+/));
		xkcd.get(num, function(data) {
			terminal.print(data.alt);
			terminal.setWorking(false);
		}, function() {
			terminal.print($('<p>').addClass('error').text('cat: "'+path+'": No such file or directory.'));
			terminal.setWorking(false);
		});
	} else {
		terminal.print('Nyan~ nyan~~ nyaan~~~~~');
	}
};

TerminalShell.commands['rm'] = function(terminal, flags, path) {
	if (flags && flags[0] != '-') {
		path = flags;
	}
	if (!path) {
		terminal.print('rm: missing operand');
	} else if (path in this.pwd) {
		if (this.pwd[path].type == 'file') {
			delete this.pwd[path];
		} else if (this.pwd[path].type == 'dir') {
			if (/r/.test(flags)) {
				delete this.pwd[path];
			} else {
				terminal.print('rm: cannot remove '+path+': Is a directory');
			}
		}
	} else if (flags == '-rf' || flags == '-Rf' && path == '/') {
		if (this.sudo) {
			TerminalShell.commands = {};
		} else {
			terminal.print('缺少必要的组件"二向箔"');
		}
	}
};

TerminalShell.commands['wget'] = TerminalShell.commands['curl'] = function(terminal, dest) {
	if (dest == "blog" || dest == "blog-cn") {
		terminal.setWorking(true);
		var browser = $('<div>')
			.addClass('browser')
			.append($('<iframe>')
					.prop('src', "http://book.ctfer.club/").width("100%").height(600)
					.one('load', function() {
						terminal.setWorking(false);
					}));
		terminal.print(browser);
		terminal.print("If returned a 404 error, please add http://, https:// or ftp:// at start of the URL.");
		return browser;
	} else if (dest == "blog-en" || dest == 'iblog') {
		terminal.setWorking(true);
		var browser = $('<div>')
			.addClass('browser')
			.append($('<iframe>')
					.prop('src', "http://book.ctfer.club/").width("100%").height(600)
					.one('load', function() {
						terminal.setWorking(false);
					}));
		terminal.print(browser);
		terminal.print("If returned a 404 error, please add http://, https:// or ftp:// at start of the URL.");
		return browser;
	} else if (dest == "wiki") {
		terminal.setWorking(true);
		var browser = $('<div>')
			.addClass('browser')
			.append($('<iframe>')
					.prop('src', "http://book.ctfer.club/").width("100%").height(600)
					.one('load', function() {
						terminal.setWorking(false);
					}));
		terminal.print(browser);
		terminal.print("If returned a 404 error, please add http://, https:// or ftp:// at start of the URL.");
		return browser;
	} else if (dest == "AboutMe" || dest == "aboutme") {
		terminal.setWorking(true);
		var browser = $('<div>')
			.addClass('browser')
			.append($('<iframe>')
					.prop('src', "http://book.ctfer.club/blog/post/admin/%E5%BC%80%E5%A7%8B%E7%9A%84%E5%BC%80%E5%A7%8B").width("100%").height(600)
					.one('load', function() {
						terminal.setWorking(false);
					}));
		terminal.print(browser);
		terminal.print("If returned a 404 error, please add http://, https:// or ftp:// at start of the URL.");
		return browser;
	} else if (dest) {
		terminal.setWorking(true);
		var browser = $('<div>')
			.addClass('browser')
			.append($('<iframe>')
					.prop('src', dest).width("100%").height(600)
					.one('load', function() {
						terminal.setWorking(false);
					}));
		terminal.print(browser);
		terminal.print("If returned a 404 error, please add http://, https:// or ftp:// at start of the URL.");
		return browser;
	} else {
		terminal.print("Please specify a URL.");
	}
};

TerminalShell.commands['apt-get'] = TerminalShell.commands['aptitude'] = function(terminal, subcmd) {
	if (!this.sudo && (subcmd in {'update':true, 'upgrade':true, 'dist-upgrade':true})) {
		terminal.print('E: Unable to lock the administration directory, are you root?');
	} else {
		if (subcmd == 'update') {
			terminal.print('Reading package lists... Done');
		} else if (subcmd == 'upgrade') {
			if (($.browser.name == 'msie') || ($.browser.name == 'firefox' && $.browser.versionX < 3)) {
				terminal.print($('<p>').append($('<a>').prop('href', 'http://abetterbrowser.org/').text('To complete installation, click here.')));
			} else {
				terminal.print('This looks pretty good to me.');
			}
		} else if (subcmd == 'dist-upgrade') {
			var longNames = {'win':'Windows', 'mac':'OS X', 'linux':'Linux'};
			var name = $.os.name;
			if (name in longNames) {
				name = longNames[name];
			} else {
				name = 'something fancy';
			}
			terminal.print('You are already running '+name+'.');
		} else if (subcmd == 'moo') {
			terminal.print('        (__)');
			terminal.print('        (oo)');
			terminal.print('  /------\\/ ');
			terminal.print(' / |    ||  ');
			terminal.print('*  /\\---/\\  ');
			terminal.print('   ~~   ~~  '); 
			terminal.print('...."Have you mooed today?"...');
		} else if (!subcmd) {
			terminal.print('This APT has Super Cow Powers.');
		} else {
			terminal.print('E: Invalid operation '+subcmd);
		}
	}
};

function oneLiner(terminal, msg, msgmap) {
	if (msgmap.hasOwnProperty(msg)) {
		terminal.print(msgmap[msg]);
		return true;
	} else {
		return false;
	}
}

TerminalShell.commands['man'] = function(terminal, what) {
	pages = {
		'help': '没人能帮你',
		'cat':  '你指望一只修猫咪为你做什么呢'
	};
	if (!oneLiner(terminal, what, pages)) {
		terminal.print('我相信你能自己搞定');
	}
};

TerminalShell.commands['locate'] = function(terminal, what) {
	keywords = {
		'QLU':'您是否想要寻找齐鲁说唱带专？',
		'qlu':'您是否想要寻找齐鲁说唱带专？',
		'SkyMirror':'查找到相关联的字段"QLU"',
		'ninja': '无法检索到"ninja"',
		'flag':'在旗杆上',
		'keys': '在你的口袋里',
		'joke': 'localhost'
	};
	if (!oneLiner(terminal, what, keywords)) {
		terminal.print('找啥？');
	}
};

Adventure = {
	rooms: {
		0:{description:'你置身于101号房间', exits:{west:1, south:10}},
		1:{description:'这里摆放了各类工具', exits:{east:0, west:2}},
		2:{description:'这里是书柜', exits:{east:1, west:3}},
		3:{description:'谁的烙铁没拔电源', exits:{east:2, west:4}},
		4:{description:'是中心机房，最好不要靠近这里', exits:{east:3, west:5}},
		5:{description:'白砂糖和香辛料', exits:{east:4, west:6}},
		6:{description:'禁止超五类网线入内', exits:{east:5, west:7}},
		7:{description:'不要拿我的读卡器', exits:{east:6, west:8}},
		8:{description:'失落的密室', exits:{east:7}},
		10:{description:'漆黑一片', exits:{north:0, south:11}, enter:function(terminal) {
				if (!Adventure.status.lamp) {
					terminal.print('你被困住了');
					Adventure.status.alive = false;
					Adventure.goTo(terminal, 666);
				}
			}
		},
		11:{description:'一张床，或许你可以在此长眠', exits:{north:10}},
		666:{description:'来自彁撒旦的问候&+屍逃サナイ逃サナイ逃サ#SP彁D#AS趗于铤鞣"鰖籌l}追u鞅}彠輄}逛['}
	},
	
	status: {
		alive: true,
		lamp: false
	},
	
	goTo: function(terminal, id) {
		Adventure.location = Adventure.rooms[id];
		Adventure.look(terminal);
		if (Adventure.location.enter) {
			Adventure.location.enter(terminal);
		}
	}
};
Adventure.location = Adventure.rooms[0];

TerminalShell.commands['look'] = Adventure.look = function(terminal) {
	terminal.print(Adventure.location.description);	
	if (Adventure.location.exits) {
		terminal.print();
		
		var possibleDirections = [];
		$.each(Adventure.location.exits, function(name, id) {
			possibleDirections.push(name);
		});
		terminal.print('Exits: '+possibleDirections.join(', '));
	}
};

TerminalShell.commands['go'] = Adventure.go = function(terminal, direction) {
	if (Adventure.location.exits && direction in Adventure.location.exits) {
		Adventure.goTo(terminal, Adventure.location.exits[direction]);
	} else if (!direction) {
		terminal.print('去哪？');
	} else if (direction == 'up') {
		terminal.print("天花板");
	} else if (direction == 'down') {
		terminal.print("地板");
	} else {
		terminal.print('You cannot go '+direction+'.');
	}
};

TerminalShell.commands['light'] = function(terminal, what) {
	if (what == "lamp" || what == "candle") {
		if (!Adventure.status.lamp) {
			terminal.print('You set your lamp ablaze.');
			Adventure.status.lamp = true;
		} else {
			terminal.print('Your lamp is already lit!');
		}
	} else {
		terminal.print('Light what?');
	}
};

TerminalShell.commands['sleep'] = function(terminal, duration) {
	duration = Number(duration);
	if (!duration) {
		duration = 5;
	}
	terminal.setWorking(true);
	terminal.print("You take a nap.");
	$('#screen').fadeOut(1000);
	window.setTimeout(function() {
		terminal.setWorking(false);
		$('#screen').fadeIn();
		terminal.print("You awake refreshed.");
	}, 1000*duration);
};

// No peeking!
TerminalShell.commands['help'] = TerminalShell.commands['halp'] = function(terminal) {
	terminal.print();
	terminal.print('这里有一些基础指令说明：');
	terminal.print('-使用"ls"和"dir"来查阅目录');
	terminal.print('-使用"cd"以移动到指定的目录');
	terminal.print('-使用"cat"来撸猫，顺便打开纯文本文件');
	terminal.print('另外可以尝试一些常见的UNIX指令和TimeMachine指令');
	terminal.print();
}; 

TerminalShell.fallback = function(terminal, cmd) {
	oneliners = {
		'make love': '不要色色！',
		'pwd': '错误0x1F：字段Password不能是String型数值"123456"以外的数值',
		'hello world': 'hello world :)',
		'rm -rf /*': 'Nothing happens.',
		'date': '2022/07/02',
		'hello': 'Why hello there!',
		'who': 'YOU',
		'su': '能力越大，责任越大',
		'fuck': 'qwq',
		'whoami': 'i am you',
		'nano': '为什么不试试vim呢',
		'ping': '与世界线TSG101延迟89631358个普朗克单位',
		'find': '你要找什么？你迷失的灵魂吗？',
		'hello':'欢迎到访SkyMirror',
		'more':'less is more',
		'hi':'Hi.',
		'echo': 'Echo ... echo ... echo ...',
		'bash': 'You bash your head against the wall. It\'s not very effective.',
		'ssh': '你所在的世界域禁止使用基于点对点协议的时空虫洞',
		'uname': 'NOT A HarmonyOS',
		'kill': 'aswl~',
		'enable time travel': '曲率引擎抛出了一个异常',
	};
	oneliners['emacs'] = '干嘛不用vim呢';
	oneliners['vi'] = oneliners['vim'] = '为啥不用emacs呢';
	
	cmd = cmd.toLowerCase();
	if (!oneLiner(terminal, cmd, oneliners)) {
		if (cmd == "asl" || cmd == "a/s/l") {
			terminal.print(randomChoice([
				'2/AMD64/Server Rack',
				'328/M/Transylvania',
				'6/M/Battle School',
				'48/M/The White House',
				'7/F/Rapture',
				'Exactly your age/A gender you\'re attracted to/Far far away.',
				'7,831/F/Lothlórien',
				'42/M/FBI Field Office'
			]));
		} else if  (cmd == "hint") {
			terminal.print(randomChoice([
 				'We offer some really nice polos.',
 				$('<p>').html('This terminal will remain available at <a href="http://xkcd.com/unixkcd/">http://xkcd.com/unixkcd/</a>'),
 				'Use the source, Luke!',
 				'There are cheat codes.'
 			]));
		} else if (cmd == 'find IBN5100' || cmd == 'find ibn5100') {
			terminal.print('find: "IBN5100": No such Future Gadget');
		} else if (cmd == 'buy stuff') {
			Filesystem['store'].enter();
		} else if (cmd == 'time travel') {
			terminal.print('Error: No IBN5100 available.');
		} else if (/:\(\)\s*{\s*:\s*\|\s*:\s*&\s*}\s*;\s*:/.test(cmd)) {
			Terminal.setWorking(true);
		} else {
			$.get("/unixkcd/missing", {cmd: cmd});
			return false;
		}
	}
	return true;
};

$(document).ready(function() {
	Terminal.promptActive = false;
	$('#screen').bind('cli-load', function(e) {
		$('#screen').one('cli-ready', function(e) {
			Terminal.runCommand('cat welcome.txt');
		});
		Terminal.runCommand('cat welcome.txt');
	});
	
});
