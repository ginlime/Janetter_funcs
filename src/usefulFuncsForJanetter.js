// Janetter 用　利用自由関数
// 2012-2013 by @ginlime

(function($, jn){

// ●outerHTML
// innerHTML() がタグの中に含まれる HTML を対象としているのに対し、outerHTML() はそれ自体を含めた HTML を返す
// http://www.yelotofu.com/2008/08/jquery-outerhtml/
$.fn.outerHTML = function(s){
	return (s)
		? this.before(s).remove()
		: $("<p>").append(this.eq(0).clone()).html();
}

// ●全置換
// dest に空文字列（''）を指定することで、全削除も可能
// replace を使った方が早いが、正規表現のエスケープをしないといけないので手抜き
String.prototype.replaceAll = function(org, dest){
	return this.split(org).join(dest);
}

// ●数字の桁揃え
// 事前に、数字を文字列化しておくこと
// 指定した桁に満たない場合は 0 で埋める
// 「文字列の繰り返し」が必要
String.prototype.pad0 = function(digit){
	var pad = '0';
	return (this.length < digit) ? pad.repeatN(digit - this.length) + this : this;
};

// ●文字列の繰り返し
String.prototype.repeatN = function(num){
	var result = "";
	while(num){
		result += this;
		num--;
	}
	return result;
};

// ●css の rgb 表記から HEX に変換
// rgb() または rgba() 表記の文字列を HEX にする
// unnecessaryNS：返す HEX にナンバーサイン（#）を必要とするかどうか
// 「全置換」「数字の桁揃え」「文字列の繰り返し」が必要
String.prototype.RGBToColorCode = function(unnecessaryNS){
	var src = this.replace(/rgba?\(/, '').replace(')', '').replaceAll(' ', ''),
		numberSign = (unnecessaryNS) ? '' : '#',
		tmpAry = src.split(','),
		result = numberSign + Number(tmpAry[0]).toString(16).pad0(2) + Number(tmpAry[1]).toString(16).pad0(2) + Number(tmpAry[2]).toString(16).pad0(2);
	return result.toUpperCase();
};

// ●色の HEX から rgb 表記に変換
// 「文字列の繰り返し」が必要
String.prototype.ColorCodeToRGB = function(){
	var src = this.replace('#',''),
		CCAry = [];
	if(src.length == 3){
		for(var i = 0; i < 3; i++){
			CCAry[i] = parseInt(src.charAt(i).repeatN(2),16);
		}
	} else {
		for(var i = 0; i < 3; i++){
			CCAry[i] = parseInt(src.substr(i*2,2),16);
		}
	}
	return CCAry.join(',');
};

// ●common.js にある format() に配列を与えて処理
String.prototype.formatWithArray = function(Array){
	return String.prototype.format.apply(this,Array);
};

// ●文字列中の改行を <br> に置き換える
String.prototype.breakToTag = function(){
	return this.replace(/\n/g, '<br>');
};

// ●文字列に含まれるスクリプトとして実行可能な要素を、実体参照化または除去して無効化する
String.prototype.killScript = function(){
	var scriptRE = new RegExp('<(/?script[^>]*)>','gi'),
		scriptReplaced = '&lt;$1&gt;',
		eventRE = new RegExp(" on[^=]*=('|\")[^'\"]*('|\")",'gi'),
		eventReplaced = '';
	return this.replace(scriptRE,scriptReplaced).replace(eventRE,eventReplaced);
};

// ●文字列から HTML タグを除去
String.prototype.removeTag = function(){
	return $('<div />').append(this).text();
};

// ●テキストを改行なし、HTML タグなしのプレーンテキストにする
// 「全置換」が必要
_textPlainize = function(text){
	return $('<div />').append(text.replaceAll("\n",'').replaceAll("\r",'')).text();
}

// ●テキストの改行を削除する
// 「全置換」が必要
_removeBreak = function(text){
	return text.replaceAll("\n",'').replaceAll("\r",'');
}

// ●HTML タグ混じりのテキストから、ハッシュタグリンクのみ殺す
// 「全置換」「outerHTML」が必要
_killHashtags = function(text){
	var dataNode = $('<div>').append(text);
	$('a.hashtag', dataNode).each(function(){
		text = text.replaceAll($(this).outerHTML(),$(this).text());
	});
	return text;
}

// ●配列の重複を取り除く
// 2 つの配列を結合して重複を取り除く場合は、common.js にある uniqueConcat を使う方が良い
Array.prototype.unique = function(){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		storageDict = new Object(),
		resultArray = new Array(),
		tempValue;
	for(var i = 0; i < targetArrayLen; i++){
		tempValue = targetArray[i];
		if (!(tempValue in storageDict)){
			storageDict[tempValue] = true;
			resultArray.push(tempValue);
		}
	}
	return resultArray;
};

// ●配列にある値が含まれているかどうか
// http://text.readalittle.net/article.php?id=135
// 多次元配列や配列中のオブジェクトまで調べるような改良版もあるようだけど、そこまで必要ないので
// あと、jQuery.inArray は微妙
Array.prototype.contains = function(value){
	for(var i in this){
		if(this.hasOwnProperty(i) && this[i] === value){
			return true;
		}
	}
	return false;
};

// ●配列から空の項目を取り除く
// doTrim：true/false 空文字の trim を行うかどうか
Array.prototype.removeblank = function(doTrim){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		resultArray = new Array();
	for(var i = 0; i < targetArrayLen; i++){
		var tmpRes = (doTrim) ? targetArray[i].trim() :targetArray[i];	// common.js の trim() を使用
		if (tmpRes != ''){
			resultArray.push(targetArray[i]);
		}
	}
	return resultArray;
};

// ●配列の全ての項目から指定された文字列（正規表現）を取り除く
Array.prototype.removestr = function(str, global, ignoreCase){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		resultArray = new Array(),
		targetStr = new RegExp(str);
	targetStr.global = global;
	targetStr.ignoreCase = ignoreCase;
	for(var i = 0; i < targetArrayLen; i++){
		resultArray.push(targetArray[i].replace(targetStr,''));
	}
	return resultArray;
};

// ●配列から指定文字数より長い項目を取り除く
Array.prototype.limitlength = function(len){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		resultArray = new Array();
	for(var i = 0; i < targetArrayLen; i++){
		if (targetArray[i].length <= len){
			resultArray.push(targetArray[i]);
		}
	}
	return resultArray;
};

// ●配列から正規表現にマッチしない項目を取り除く
Array.prototype.removenotmatch = function(regExp){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		resultArray = new Array(),
		targetStr = new RegExp(regExp);
	for(var i = 0; i < targetArrayLen; i++){
		if (targetArray[i].match(targetStr)){
			resultArray.push(targetArray[i]);
		}
	}
	return resultArray;
};

// ●フォームパーツに値をセットする
// 入力値の妥当性はチェックしない
// file、image、button、submit、reset は当然スルー
setValueToForm = function(id,value){
	var targetNode = $('#'+id),
		targetType = targetNode.attr('type') || targetNode.prop('tagName');
	switch(targetType){
		case 'text':
		case 'password':
		case 'hidden':
		case 'SELECT':	// <select>
		// HTML5
		case 'number':
		case 'range':
		// HTML5 ……Janetter で必要あるのか？
		case 'search':
		case 'tel':
		case 'url':
		case 'email':
		case 'time':
		case 'datetime':
		case 'datetime-local':
		case 'date':
		case 'month':
		case 'week':
		case 'color':
			targetNode.val(value);
			break;
		case 'checkbox':
		case 'radio':	// ※個別の選択肢に id が必要
			if(typeof value=='string'){	// いちおう型のミスをフォロー
				if(value.toLowerCase()=='true')
					value = true;
				else if(value.toLowerCase()=='false')
					value = false;
				else
					return;
			}
			targetNode.prop('checked',value);
			break;
	}
};

// ●指定された先祖ノードまで遡って要素の絶対位置を取得する
// たぶん、position が relative の場合でも使えるはず
// 階層が深い場合は使わない方がいい
getAbsolutePositionRunningBack = function(elem, ancestor){	// ancestor は selector で指定
	var left = elem.prop('offsetLeft'),
		top = elem.prop('offsetTop');
	do{
		elem = $(elem.parent().get(0));
		left += elem.prop('offsetLeft');
		top += elem.prop('offsetTop');
	} while($(elem).html()!=$(ancestor).html());
	return {'left':left,'top':top};
};

// ●プラットフォームの判定
function _determinPlatform(){
	return (navigator.userAgent.indexOf('Windows')>=0) ? 'Win' :
			(navigator.userAgent.indexOf('Macintosh')>=0) ? 'Mac' : 'other';
}

// ●指定文字数のランダム文字列を生成
// http://blog.bornneet.com/Entry/143/
// http://webengineerlife.com/2011/10/20/javascript-random-text/
// 	len：必要なランダム文字列の文字数
// 	additional：0-9、A-Z、a-z 以外に追加したい場合。シングルクォーテーションとダブルクォーテーションは指定不可
randomStr = function(len, additional){
	var srcAry = [],
		addLen = (additional) ? additional.length : 0,
		aryLen,
		resStr = '';
	for(var i = 0; i < 10; i++){
		srcAry.push(String.fromCharCode('0'.charCodeAt() + i));
	}
	for(var i = 0; i < 26; i++){
		srcAry.push(String.fromCharCode('A'.charCodeAt() + i));
	}
	for(var i = 0; i < 26; i++){
		srcAry.push(String.fromCharCode('a'.charCodeAt() + i));
	}
	if(additional){
		for(var i = 0; i < addLen; i++){
			var tmpChar = additional.charAt(i);
			if(tmpChar!="'" && tmpChar!='"')	// クォーテーション類は使用不可
				srcAry.push(tmpChar);
		}
	}
	aryLen = srcAry.length;
	for(var i = 0; i < len; i++){
		resStr += srcAry[Math.floor(Math.random()*aryLen)];
	}
	return resStr;
}

// ●設定の同期を取る
// 「全置換」「指定文字数のランダム文字列を生成」が必要
// メイン画面を集約点として扱い、そこからプロフィール画面と設定画面、通知ポップアップに拡散する
// ※引数を単体のオブジェクトにして、上記のプロパティを含める形にすることも可能
// 	srcWindow：元の画面。起点の画面で指定。_Janetter_Window_Type で取得できるのと同じもの。必須（オブジェクト渡しの場合、自動で補うためなくても良い）
// 	isSrcProfile：プロフィール画面を起点に実行する際に、true を指定する（true/false）。プロフィール画面で実行する場合には必須（オブジェクト渡しの場合、自動で補うためなくても良い）。main と profile で共通して実行する場合は(_Janetter_Window_Type=='profile')を指定すると楽
// 	configName：保存したい設定項目の名称。必須
// 	configData：保存したい設定項目のデータ。必須
// 	configIsBoole：保存したい設定項目のデータが Boolean かどうか（true/false）。無指定の場合は false 扱い。オブジェクト渡しの場合、自動で補うので不要
// 	funcExecOnMain：同期を取った後にメイン画面で実行する関数名（文字列で指定）
// 	funcExecOnProf：同期を取った後にプロフィール画面で実行する関数名（文字列で指定）
// 	funcExecOnConf：同期を取った後に設定画面で実行する関数名（文字列で指定）
// 	funcExecOnNotice：同期を取った後に通知ポップアップ画面で実行する関数名（文字列で指定）
// 	dontSave：メイン画面で保存をしない（true/false）。複数の設定項目の同期を取る場合など連続して syncConfig をかける場合に使う
// 	profTrack：プロフィール画面で実行したとき、メイン画面からの戻りをトラッキングするための文字列。自動生成するため、通常は指定なし
// ※「funcExecOn～」の関数に引数は渡せないので、引数が不要な形にしておくこと
// ※↓の変数も必要
var isSrcProfileWindow = {};
syncConfig = function(srcWindow, isSrcProfile, configName, configData, configIsBoole, funcExecOnMain, funcExecOnProf, funcExecOnConf, funcExecOnNotice, dontSave, profTrack){
	var dataIsEmpty = (configData==undefined),
		lackSrcProfile = (srcWindow=='profile' && isSrcProfile==undefined);
	// 引数がオブジェクトの場合に、変数に展開
	if(typeof arguments[0]=='object'){
		isSrcProfile = arguments[0].isSrcProfile || (_Janetter_Window_Type=='profile');	// オブジェクトで引数が渡される場合はユーザー指定と見なして指定がなくても補う
		configName = arguments[0].configName || '';
		configData = arguments[0].configData;
		dataIsEmpty = (arguments[0].configData==undefined);
		configIsBoole = arguments[0].configIsBoole || (typeof configData == 'boolean');
		funcExecOnMain = arguments[0].funcExecOnMain || '';
		funcExecOnProf = arguments[0].funcExecOnProf || '';
		funcExecOnConf = arguments[0].funcExecOnConf || '';
		funcExecOnNotice = arguments[0].funcExecOnNotice || '';
		dontSave = arguments[0].dontSave || false;
		profTrack = '';	// profTrack は自動生成するため、オブジェクトで引数が渡される場合はユーザー指定と見なして指定なし
		srcWindow = arguments[0].srcWindow || _Janetter_Window_Type;	// srcWindow は arguments[0] なので後回し。オブジェクトで引数が渡される場合はユーザー指定と見なして指定がなくても補う
	}
	// 必須項目のチェック
	if(!srcWindow){
		console.warn('syncConfig：srcWindow が不足しています。');
		return false;
	}
	if(!configName){
		console.warn('syncConfig：configName が不足しています。');
		return false;
	}
	if(dataIsEmpty){
		console.warn('syncConfig：configData が不足しています。');
		return false;
	}
	if(lackSrcProfile){
		console.warn('syncConfig：isSrcProfile が不足しています。');
		return false;
	}
	// isSrcProfile と configIsBoole、dontSave は webViewAction での引き渡し時に
	// Boolean が String に変換されているケースがあるため、補正する
	isSrcProfile = (typeof isSrcProfile=='string') ?
						(isSrcProfile=='true') ?
							true :
							false :
						isSrcProfile;
	configIsBoole = (typeof configIsBoole=='string') ?
						(configIsBoole=='true') ?
							true :
							false :
						configIsBoole;
	dontSave = (typeof dontSave=='string') ?
						(dontSave=='true') ?
							true :
							false :
						dontSave;
	// 引き渡し用データを configData に、保存用データを configDataSave に分ける
	var configDataSave = configData;
	// webViewAction での引き渡し時に Boolean が String に変換されているケースがあるため、
	// configIsBoole で与えられた情報に沿って保存用データを補正する
	configDataSave = (configIsBoole && typeof configDataSave=='string') ?
						(configDataSave=='true') ?
							true :
							false :
						configDataSave;
	// 保存用データが文字列の場合、ダブルクォーテーションをエンコード（文字実体参照化）/デコードする
	// 元のデータが Boolean のケースは上記で選別が完了しているので気にしなくて良い
	if(typeof configDataSave=='string'){
		if((srcWindow=='profile'&&isSrcProfile)||(srcWindow!='profile'&&srcWindow==_Janetter_Window_Type)){
			// データを引き渡す場合
			// ・元のウィンドウが profile で、起点のウィンドウの場合
			// 　or
			// ・元のウィンドウが profile ではなくて、元のウィンドウと現在のウィンドウが一致する場合
			// 引き渡し用データ（configData）をエンコードする
			configData = configData.replaceAll('&','&amp;').replaceAll('"','&quot;');
			// 保存用データは生の状態なのでエンコードの必要なし
		} else {
			// データが引き渡されてきた場合
			// ・元のウィンドウが profile で、起点のウィンドウではない場合
			// 　or
			// ・元のウィンドウと現在のウィンドウが一致しない場合
			// ※profile が起点のウィンドウだった場合には、データの引き渡し時点で
			// 　isSrcProfile を false に設定しているので、引き渡される側でこちらの
			// 　条件に適合することはあり得ない
			// 保存用データ（configDataSave）をデコードする
			configDataSave = configDataSave.replaceAll('&quot;','"').replaceAll('&amp;','&');
			// 引き渡し用データはエンコードされた状態のままパススルーする
		}
	}
	// 指定された設定項目に保存用データを入れる
	jn.conf[configName] = configDataSave;
	// ウィンドウごとの処理
	switch(_Janetter_Window_Type){
		case 'main':
			// 現在のウィンドウがメインの場合のみ、dontSave が true でなければデータを保存する
			if(!dontSave)
				jn.setConfig(jn.conf);
			// 以下、main に来ている段階で、isSrcProfile は必ず false、dontSave も考慮の必要なし
			// すべて、引き渡し先のウィンドウは終端なので、該当する関数以外は引き渡さない
			// 元のウィンドウタイプがどれであっても、profile にはもれなく引き渡す
			jn.webViewAction('profJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","'+funcExecOnProf+'","","",'+false+',"'+profTrack+'")'});
			// 元のウィンドウタイプが config でなければ、config に引き渡す
			if(srcWindow!='config')
				jn.webViewAction('confJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","'+funcExecOnConf+'","",'+false+',"'+profTrack+'")'});
			// 元のウィンドウタイプが notice でなければ、notice に引き渡す
			if(srcWindow!='notice')
				jn.webViewAction('noticeJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","","'+funcExecOnNotice+'",'+false+',"'+profTrack+'")'});
			if(srcWindow!='main' && funcExecOnMain)	// 自身が起点の場合は funcExecOnMain は実行しない
				eval(funcExecOnMain+'()');
			break;
		case 'profile':
			// profile は、自身のウィンドウ以外に、同じタイプのウィンドウが他に存在するケースがある
			// main を経由して他のウィンドウに拡散させるが、その過程で main から自身にも戻ってくることを考慮
			if(srcWindow=='profile' && isSrcProfile){	// 自身が発信元の場合の初回実行。フラグを立てて main に引き渡す
				var trackStr = randomStr(10);
				isSrcProfileWindow[trackStr] = true;
				jn.webViewAction('mainJS', {cmd:'syncConfig("profile",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","'+funcExecOnNotice+'",'+dontSave+',"'+trackStr+'")'});
			}
			if((srcWindow!='profile' || (profTrack!='' && !isSrcProfileWindow[profTrack])) && funcExecOnProf)	// 自身が起点の場合は funcExecOnProf は実行しない
				eval(funcExecOnProf+'()');
			if(!isSrcProfile && isSrcProfileWindow[profTrack])	// 自身が発信元の場合の戻りは、フラグを元に戻す
				isSrcProfileWindow[profTrack] = false;
			break;
		case 'config':
			if(srcWindow == 'config')	// 自身が発信元の場合のみ main に引き渡す
				jn.webViewAction('mainJS', {cmd:'syncConfig("config",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","","'+funcExecOnNotice+'",'+dontSave+',"")'});
			else if(funcExecOnConf)	// 自身が起点の場合は funcExecOnConf は実行しない
				eval(funcExecOnConf+'()');
			break;
		case 'notice':
			if(srcWindow == 'notice')	// 自身が発信元の場合のみ main に引き渡す
				jn.webViewAction('mainJS', {cmd:'syncConfig("notice",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","",'+dontSave+',"")'});
			else if(funcExecOnNotice)	// 自身が起点の場合は funcExecOnNotice は実行しない
				eval(funcExecOnNotice+'()');
			break;
	}
	return true;
};

// ●syncConfig コメント抜き版
var isSrcProfileWindow = {};
syncConfig = function(srcWindow, isSrcProfile, configName, configData, configIsBoole, funcExecOnMain, funcExecOnProf, funcExecOnConf, funcExecOnNotice, dontSave, profTrack){
	var dataIsEmpty = (configData==undefined),
		lackSrcProfile = (srcWindow=='profile' && isSrcProfile==undefined);
	if(typeof arguments[0]=='object'){
		isSrcProfile = arguments[0].isSrcProfile || (_Janetter_Window_Type=='profile');
		configName = arguments[0].configName || '';
		configData = arguments[0].configData;
		dataIsEmpty = (arguments[0].configData==undefined);
		configIsBoole = arguments[0].configIsBoole || (typeof configData == 'boolean');
		funcExecOnMain = arguments[0].funcExecOnMain || '';
		funcExecOnProf = arguments[0].funcExecOnProf || '';
		funcExecOnConf = arguments[0].funcExecOnConf || '';
		funcExecOnNotice = arguments[0].funcExecOnNotice || '';
		dontSave = arguments[0].dontSave || false;
		profTrack = '';
		srcWindow = arguments[0].srcWindow || _Janetter_Window_Type;
	}
	if(!srcWindow){
		console.warn('syncConfig：srcWindow が不足しています。');
		return false;
	}
	if(!configName){
		console.warn('syncConfig：configName が不足しています。');
		return false;
	}
	if(dataIsEmpty){
		console.warn('syncConfig：configData が不足しています。');
		return false;
	}
	if(lackSrcProfile){
		console.warn('syncConfig：isSrcProfile が不足しています。');
		return false;
	}
	isSrcProfile = (typeof isSrcProfile=='string') ?
						(isSrcProfile=='true') ?
							true :
							false :
						isSrcProfile;
	configIsBoole = (typeof configIsBoole=='string') ?
						(configIsBoole=='true') ?
							true :
							false :
						configIsBoole;
	dontSave = (typeof dontSave=='string') ?
						(dontSave=='true') ?
							true :
							false :
						dontSave;
	var configDataSave = configData;
	configDataSave = (configIsBoole && typeof configDataSave=='string') ?
						(configDataSave=='true') ?
							true :
							false :
						configDataSave;
	if(typeof configDataSave=='string'){
		if((srcWindow=='profile'&&isSrcProfile)||(srcWindow!='profile'&&srcWindow==_Janetter_Window_Type)){
			configData = configData.replaceAll('&','&amp;').replaceAll('"','&quot;');
		} else {
			configDataSave = configDataSave.replaceAll('&quot;','"').replaceAll('&amp;','&');
		}
	}
	jn.conf[configName] = configDataSave;
	switch(_Janetter_Window_Type){
		case 'main':
			if(!dontSave)
				jn.setConfig(jn.conf);
			jn.webViewAction('profJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","'+funcExecOnProf+'","","",'+false+',"'+profTrack+'")'});
			if(srcWindow!='config')
				jn.webViewAction('confJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","'+funcExecOnConf+'","",'+false+',"'+profTrack+'")'});
			if(srcWindow!='notice')
				jn.webViewAction('noticeJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","","'+funcExecOnNotice+'",'+false+',"'+profTrack+'")'});
			if(srcWindow!='main' && funcExecOnMain)
				eval(funcExecOnMain+'()');
			break;
		case 'profile':
			if(srcWindow=='profile' && isSrcProfile){
				var trackStr = randomStr(10);
				isSrcProfileWindow[trackStr] = true;
				jn.webViewAction('mainJS', {cmd:'syncConfig("profile",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","'+funcExecOnNotice+'",'+dontSave+',"'+trackStr+'")'});
			}
			if((srcWindow!='profile' || (profTrack!='' && !isSrcProfileWindow[profTrack])) && funcExecOnProf)
				eval(funcExecOnProf+'()');
			if(!isSrcProfile && isSrcProfileWindow[profTrack])
				isSrcProfileWindow[profTrack] = false;
			break;
		case 'config':
			if(srcWindow == 'config')
				jn.webViewAction('mainJS', {cmd:'syncConfig("config",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","","'+funcExecOnNotice+'",'+dontSave+',"")'});
			else if(funcExecOnConf)
				eval(funcExecOnConf+'()');
			break;
		case 'notice':
			if(srcWindow == 'notice')
				jn.webViewAction('mainJS', {cmd:'syncConfig("notice",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","",'+dontSave+',"")'});
			else if(funcExecOnNotice)
				eval(funcExecOnNotice+'()');
			break;
	}
	return true;
};

// ●メッセージの翻訳データを追加
// msg はその下に連想配列で en や ja などの言語コード別に文字列リソースを、さらに連想配列として持っていることが前提
// 利用方法は @ginlime のプラグインを参照のこと（janet.onGetMessages を乗っ取って、オリジナルの実行前に実行する）
// additionalProc に関数を指定することで、例えば特定のデータを format するといったような加工が可能
addTranslateData = function(msg, additionalProc){
	var msgData = msg[jn.conf.lang];
	if(msgData == undefined)
		msgData = msg['en'];
	additionalProc && additionalProc(msgData);
	assignTo(jn.msg, msgData);
};

// ●数値を昇順で入れた配列に対し、指定した値がどの index の間にあり、
// その範囲での比率はいくつなのか
// 戻り値：object
// 　　　　start：開始 index
// 　　　　end：終了 index
// 　　　　ratio：比率
// 範囲外の場合は、すべて -1 で返す
checkBetween = function(targetArray, value){
	var aryLen = targetArray.length,
		start = -1,
		end = -1,
		ratio = -1;
	for(var i = 1; i < aryLen; i++){
		if(targetArray[i-1] < value && value < targetArray[i]){
			start = i - 1;
			end = i;
			ratio = (value - targetArray[start]) / (targetArray[end] - targetArray[start]);
			break;
		}
	}
	return {'start':start, 'end':end, 'ratio':ratio};
};

// ●比率を値または配列に適用する
// 対象となる値の型は同一であることを前提とし、配列の長さも同一であるものとする
// 戻り値はすべて整数になる
applyRatio = function(targetA, targetB, ratio){
	if(typeof targetA == "object"){
		var targetLen = targetA.length,
			resultAry = [];
		for( var i = 0; i < targetLen; i++){
			resultAry.push(parseInt((targetB[i] - targetA[i]) * ratio + targetA[i]));
		}
		return resultAry;
	} else {
		return parseInt((targetB - targetA) * ratio + targetA);
	}
};

// ●Object の子要素数（連想配列の要素数）
objectLength = function(obj){
	var cnt = 0;
	$.each(obj, function(){
		cnt++;
	});
	return cnt;
};

// ●オーバーレイ付きのプログレスバーを表示する jquery.ui.progressOverlay
// jquery.ui.dialog と jquery.ui.progressbar を参考に作成
// Janetter は Chrome ベースのため、IE6 は完全に無視しているので、
// 移植などしてクロスブラウザで使う場合には注意
// 実際の使用例は、一括ブロックプラグインを参照のこと

var uiProgressClasses = 
		'ui-progressOverlay ' +
		'ui-progressOverlay-screen ' +
		'ui-widget ' +
		'ui-widget-content ' +
		'ui-corner-all ';

$.widget("ui.progressOverlay", {
	options: {
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos){
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0){
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		autoOpen: true,
		closeOnEscape: false,	// デバッグ用
		value: 0,
		max: 100,
		msg: '',
		valueStyle: 'percentage',	// percentage / number
		valueMsg: '%1 / %2%',	// %1: current value / %2: max value
		changeValueStyle: null,	// funtion to change value bar style
		completionWait: 1500,
		completionMsg: '',
		completionValueMsg: '',
		done: null,
		zIndex: 2000
	},
	min: 0,
	_create: function(){
		var self = this,
			options = self.options,
			valueToSet = (options.valueStyle == 'percentage') ? self._percentage() : self.value(),
			maxToSet = (options.valueStyle == 'percentage') ? '100' : options.max,
			uiProgressValueArea = (self.uiProgressValueArea = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-valueArea ' +
					'ui-widget-content '
				)
			uiProgressScreen = (self.uiProgressScreen = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiProgressClasses)
				.css({
					zIndex: options.zIndex
				})
				.attr('tabIndex', -1)
				.css('outline', 0)
				.keydown(function(event){
					if (options.closeOnEscape && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE){
						
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'progressOverlay',
					"aria-minValue": self.min,
					"aria-maxValue": options.max,
					"aria-currentValue": self._value()
				})
				.append(uiProgressValueArea),
			uiProgressMsg = (self.uiProgressMsg = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-msg ' +
					'ui-widget-content '
				)
				.html(options.msg)
				.prependTo(uiProgressScreen),
			uiProgressBarShell = (self.uiProgressBarShell = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-barShell ' +
					'ui-widget-content ' +
					'ui-corner-all '
				)
				.appendTo(uiProgressValueArea),
			uiProgressBar = self.element
				.show()
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-bar ' +
					'ui-widget-content ' +
					'ui-corner-all '
				)
				.appendTo(uiProgressBarShell),
			uiProgressValue = (self.uiProgressValue = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-value ' +
					'ui-widget-content ' +
					'ui-corner-left '
				)
				.appendTo(uiProgressBar),
			uiProgressValueBg = (self.uiProgressValueBg = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-valueBg ' +
					'ui-widget-content ' +
					'ui-corner-left '
				)
				.appendTo(uiProgressBar),
			uiProgressValueMsg = (self.uiProgressValueMsg = $('<div></div>'))
				.addClass(
					'ui-progressOverlay-content ' +
					'ui-progressOverlay-valueMsg ' +
					'ui-widget-content '
				)
				.html(options.valueMsg.format(valueToSet, maxToSet))
				.appendTo(uiProgressValueArea);

		self._isOpen = false;
		self.oldValue = self._value();
		self._refreshValue();
	},
	_init: function(){
		if ( this.options.autoOpen ){
			this.open();
		}
	},
	destroy: function(){
		var self = this;
		
		if (self.overlay){
			self.overlay.destroy();
		}

		self.uiProgressScreen.hide();
		self.element
			.unbind('.progressOverlay')
			.removeData('progressOverlay')
			.removeClass('ui-progressOverlay-content ui-widget-content ui-corner-all');
		self.uiProgressScreen.remove();

		return self;
	},
	widget: function(){
		return this.uiProgressScreen;
	},
	_value: function(){
		var self = this,
			options = self.options;
		// normalize invalid value
		if ( typeof options.value !== "number" ){
			options.value = 0;
		}
		return Math.min( options.max, Math.max( self.min, options.value ) );
	},
	_complete: function(){
		var self = this;
		setTimeout(function(){self.close()}, self.options.completionWait);
	},
	close: function(event){
		var self = this;

		if (self.overlay){
			self.overlay.destroy();
		}

		self._isOpen = false;

		self.uiProgressScreen.hide();
		self._trigger('close', event);

		$.ui.progressOverlay.overlay.resize();

		self.options.done && self.options.done(event);

		return self;
	},
	moveToTop: function(event){
		var self = this,
			options = self.options;
		if (options.zIndex > $.ui.progressOverlay.maxZ){
			$.ui.progressOverlay.maxZ = options.zIndex;
		}
		if (self.overlay){
			$.ui.progressOverlay.maxZ += 1;
			self.overlay.$el.css('z-index', $.ui.progressOverlay.overlay.maxZ = $.ui.progressOverlay.maxZ);
		}
		$.ui.progressOverlay.maxZ += 1;
		self.uiProgressScreen.css('z-index', $.ui.progressOverlay.maxZ);
		self._trigger('focus', event);

		return self;
	},
	open: function(){
		if (this._isOpen){ return; }

		var self = this,
			options = self.options,
			uiProgressScreen = self.uiProgressScreen;

		self.overlay = new $.ui.progressOverlay.overlay(self);
		self._position();
		uiProgressScreen.show();
		self.moveToTop(true);

		self._isOpen = true;
		self._trigger('open');

		return self;
	},
	isOpen: function(){
		return this._isOpen;
	},
	_position: function(position){
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position){
			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)){
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1){
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition){
					if (+myAt[i] === myAt[i]){
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.ui.progressOverlay.prototype.options.position, position);
		} else {
			position = $.ui.progressOverlay.prototype.options.position;
		}

		isVisible = this.uiProgressScreen.is(':visible');
		if (!isVisible){
			this.uiProgressScreen.show();
		}
		this.uiProgressScreen
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible){
			this.uiProgressScreen.hide();
		}
	},
	_setOptions: function( options ){
		var self = this;
		$.each( options, function( key, value ){
			self._setOption( key, value );
		});
	},
	_setOption: function(key, value){
		var self = this,
			uiProgressScreen = self.uiProgressScreen;
		switch (key){
			case "value":
				self.options.value = value;
				self._refreshValue();
				break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	},
	value: function( newValue ){
		var self = this;
		if ( newValue === undefined ){
			return self._value();
		}

		self._setOption( "value", newValue );
		return self;
	},
	_percentage: function(){
		return Number(Number(100 * this._value() / this.options.max).toFixed(1));
	},
	_refreshValue: function(){
		var self = this,
			options = self.options,
			value = self.value(),
			valueToSet = (options.valueStyle == 'percentage') ? self._percentage() : value,
			maxToSet = (options.valueStyle == 'percentage') ? '100' : options.max,
			percentage = self._percentage();

		if ( self.oldValue !== value ){
			self.oldValue = value;
			self._trigger( "change" );
		}
		var valueWidth = percentage.toFixed(0) + "%";
		self.uiProgressValueBg
			.toggle( value > self.min )
			.toggleClass( "ui-corner-right", value === options.max )
			.width( valueWidth );
		self.uiProgressValue
			.toggle( value > self.min )
			.toggleClass( "ui-corner-right", value === options.max )
			.width( valueWidth );
		options.changeValueStyle && options.changeValueStyle(value, options.max);
		this.element.attr( "aria-currentValue", value );
		self.uiProgressValueMsg.html(options.valueMsg.format(valueToSet, maxToSet));
		if(value == options.max){
			if(options.completionMsg != ''){
				self.uiProgressMsg.html(options.completionMsg);
			}
			if(options.completionValueMsg != ''){
				self.uiProgressValueMsg.html(options.completionValueMsg);
			}
			self._complete();
		}
	}
});

$.extend($.ui.progressOverlay, {
	version: "0.0.1",
	maxZ: 0,

	overlay: function(progress){
		this.$el = $.ui.progressOverlay.overlay.create(progress);
	}
});

$.extend($.ui.progressOverlay.overlay, {
	instances: [],
	maxZ: 0,
	oldInstances: [],
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event){ return event + '.progressOverlay-overlay'; }).join(' '),
	create: function(progressOverlay){
		if (this.instances.length === 0){
			setTimeout(function(){
				if ($.ui.progressOverlay.overlay.instances.length){
					$(document).bind($.ui.progressOverlay.overlay.events, function(event){
						if ($(event.target).zIndex() < $.ui.progressOverlay.overlay.maxZ){
							return false;
						}
					});
				}
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.progressOverlay-overlay', function(event){
				if (progressOverlay.options.closeOnEscape && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE){
					
					progressOverlay.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.progressOverlay-overlay', $.ui.progressOverlay.overlay.resize);
		}

		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay'))
			.appendTo(document.body)
			.css({
				width: this.width(),
				height: this.height()
			});

		if ($.fn.bgiframe){
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el){
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0){
			$([document, window]).unbind('.progressOverlay-overlay');
		}

		$el.remove();
		
		var maxZ = 0;
		$.each(this.instances, function(){
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function(){
		return $(document).height() + 'px';
	},

	width: function(){
		return $(document).width() + 'px';
	},

	resize: function(){
		var $overlays = $([]);
		$.each($.ui.progressOverlay.overlay.instances, function(){
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.progressOverlay.overlay.width(),
			height: $.ui.progressOverlay.overlay.height()
		});
	}
});

$.extend($.ui.progressOverlay.overlay.prototype, {
	destroy: function(){
		$.ui.progressOverlay.overlay.destroy(this.$el);
	}
});
// jquery.ui.progressOverlay ここまで

})(jQuery, janet);
