// Janetter �p�@���p���R�֐�
// 2012-2013 by @ginlime
// �ŏI�X�V�F2013/01/13
// 
// ���̊֐��Q�́A���ۏ؂ł��邱�Ƃ�O��ɁAJanetter �̃v���O�C���A�e�[�}�𐧍삷��l�����R�ɗ��p�ł��܂��B
// Janetter �ŗL�̕ϐ���֐��A�E�B���h�E�\���𗘗p���Ă��邽�߁A���� Web �A�v���P�[�V�����Ȃǂł͐���ɓ��삵�Ȃ��ꍇ������܂��B
// �t�B�[�h�o�b�N�⑼�ɗL�p�Ȋ֐��̂��񋟂͊��}���܂��B
// �g�p��ɂ��ẮA@ginlime �̊e�v���O�C�����Q�Ƃ̂��ƁB
// �Ȃ��A�����p�ɂȂ�ۂɈꌾ������������������΁A�ȍ~�̍X�V���ɂ͂��m�点���܂��B

(function($, jn){

// ��outerHTML
// innerHTML() ���^�O�̒��Ɋ܂܂�� HTML ��ΏۂƂ��Ă���̂ɑ΂��AouterHTML() �͂��ꎩ�̂��܂߂� HTML ��Ԃ�
// http://www.yelotofu.com/2008/08/jquery-outerhtml/
$.fn.outerHTML = function(s){
	return (s)
		? this.before(s).remove()
		: $("<p>").append(this.eq(0).clone()).html();
}

// ���S�u��
// dest �ɋ󕶎���i''�j���w�肷�邱�ƂŁA�S�폜���\
// replace ���g���������������A���K�\���̃G�X�P�[�v�����Ȃ��Ƃ����Ȃ��̂Ŏ蔲��
String.prototype.replaceAll = function(org, dest){
	return this.split(org).join(dest);
}

// �������̌�����
// ���O�ɁA�����𕶎��񉻂��Ă�������
// �w�肵�����ɖ����Ȃ��ꍇ�� 0 �Ŗ��߂�
// �u������̌J��Ԃ��v���K�v
String.prototype.pad0 = function(digit){
	var pad = '0';
	return (this.length < digit) ? pad.repeatN(digit - this.length) + this : this;
};

// ��������̌J��Ԃ�
String.prototype.repeatN = function(num){
	var result = "";
	while(num){
		result += this;
		num--;
	}
	return result;
};

// ��css �� rgb �\�L���� HEX �ɕϊ�
// rgb() �܂��� rgba() �\�L�̕������ HEX �ɂ���
// unnecessaryNS�F�Ԃ� HEX �Ƀi���o�[�T�C���i#�j��K�v�Ƃ��邩�ǂ���
// �u�S�u���v�u�����̌������v�u������̌J��Ԃ��v���K�v
String.prototype.RGBToColorCode = function(unnecessaryNS){
	var src = this.replace(/rgba?\(/, '').replace(')', '').replaceAll(' ', ''),
		numberSign = (unnecessaryNS) ? '' : '#',
		tmpAry = src.split(','),
		result = numberSign + Number(tmpAry[0]).toString(16).pad0(2) + Number(tmpAry[1]).toString(16).pad0(2) + Number(tmpAry[2]).toString(16).pad0(2);
	return result.toUpperCase();
};

// ���F�� HEX ���� rgb �\�L�ɕϊ�
// �u������̌J��Ԃ��v���K�v
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

// ��common.js �ɂ��� format() �ɔz���^���ď���
String.prototype.formatWithArray = function(Array){
	return String.prototype.format.apply(this,Array);
};

// �������񒆂̉��s�� <br> �ɒu��������
String.prototype.breakToTag = function(){
	return this.replace(/\n/g, '<br>');
};

// ��������Ɋ܂܂��X�N���v�g�Ƃ��Ď��s�\�ȗv�f���A���̎Q�Ɖ��܂��͏������Ė���������
String.prototype.killScript = function(){
	var scriptRE = new RegExp('<(/?script[^>]*)>','gi'),
		scriptReplaced = '&lt;$1&gt;',
		eventRE = new RegExp(" on[^=]*=('|\")[^'\"]*('|\")",'gi'),
		eventReplaced = '';
	return this.replace(scriptRE,scriptReplaced).replace(eventRE,eventReplaced);
};

// �������񂩂� HTML �^�O������
String.prototype.removeTag = function(){
	return $('<div />').append(this).text();
};

// ���e�L�X�g�����s�Ȃ��AHTML �^�O�Ȃ��̃v���[���e�L�X�g�ɂ���
// �u�S�u���v���K�v
_textPlainize = function(text){
	return $('<div />').append(text.replaceAll("\n",'').replaceAll("\r",'')).text();
}

// ���e�L�X�g�̉��s���폜����
// �u�S�u���v���K�v
_removeBreak = function(text){
	return text.replaceAll("\n",'').replaceAll("\r",'');
}

// ��HTML �^�O������̃e�L�X�g����A�n�b�V���^�O�����N�̂ݎE��
// �u�S�u���v�uouterHTML�v���K�v
_killHashtags = function(text){
	var dataNode = $('<div>').append(text);
	$('a.hashtag', dataNode).each(function(){
		text = text.replaceAll($(this).outerHTML(),$(this).text());
	});
	return text;
}

// ���z��̏d������菜��
// 2 �̔z����������ďd������菜���ꍇ�́Acommon.js �ɂ��� uniqueConcat ���g�������ǂ�
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

// ���z��ɂ���l���܂܂�Ă��邩�ǂ���
// http://text.readalittle.net/article.php?id=135
// �������z���z�񒆂̃I�u�W�F�N�g�܂Œ��ׂ�悤�ȉ��ǔł�����悤�����ǁA�����܂ŕK�v�Ȃ��̂�
// ���ƁAjQuery.inArray �͔���
Array.prototype.contains = function(value){
	for(var i in this){
		if(this.hasOwnProperty(i) && this[i] === value){
			return true;
		}
	}
	return false;
};

// ���z�񂩂��̍��ڂ���菜��
// doTrim�Ftrue/false �󕶎��� trim ���s�����ǂ���
Array.prototype.removeblank = function(doTrim){
	var targetArray = this,
		targetArrayLen = targetArray.length,
		resultArray = new Array();
	for(var i = 0; i < targetArrayLen; i++){
		var tmpRes = (doTrim) ? targetArray[i].trim() :targetArray[i];	// common.js �� trim() ���g�p
		if (tmpRes != ''){
			resultArray.push(targetArray[i]);
		}
	}
	return resultArray;
};

// ���z��̑S�Ă̍��ڂ���w�肳�ꂽ������i���K�\���j����菜��
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

// ���z�񂩂�w�蕶������蒷�����ڂ���菜��
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

// ���z�񂩂琳�K�\���Ƀ}�b�`���Ȃ����ڂ���菜��
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

// ���t�H�[���p�[�c�ɒl���Z�b�g����
// ���͒l�̑Ó����̓`�F�b�N���Ȃ�
// file�Aimage�Abutton�Asubmit�Areset �͓��R�X���[
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
		// HTML5 �c�cJanetter �ŕK�v����̂��H
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
		case 'radio':	// ���ʂ̑I������ id ���K�v
			if(typeof value=='string'){	// ���������^�̃~�X���t�H���[
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

// ���w�肳�ꂽ��c�m�[�h�܂ők���ėv�f�̐�Έʒu���擾����
// ���Ԃ�Aposition �� relative �̏ꍇ�ł��g����͂�
// �K�w���[���ꍇ�͎g��Ȃ���������
getAbsolutePositionRunningBack = function(elem, ancestor){	// ancestor �� selector �Ŏw��
	var left = elem.prop('offsetLeft'),
		top = elem.prop('offsetTop');
	do{
		elem = $(elem.parent().get(0));
		left += elem.prop('offsetLeft');
		top += elem.prop('offsetTop');
	} while($(elem).html()!=$(ancestor).html());
	return {'left':left,'top':top};
};

// ���v���b�g�t�H�[���̔���
function _determinPlatform(){
	return (navigator.userAgent.indexOf('Windows')>=0) ? 'Win' :
			(navigator.userAgent.indexOf('Macintosh')>=0) ? 'Mac' : 'other';
}

// ���w�蕶�����̃����_��������𐶐�
// http://blog.bornneet.com/Entry/143/
// http://webengineerlife.com/2011/10/20/javascript-random-text/
// 	len�F�K�v�ȃ����_��������̕�����
// 	additional�F0-9�AA-Z�Aa-z �ȊO�ɒǉ��������ꍇ�B�V���O���N�H�[�e�[�V�����ƃ_�u���N�H�[�e�[�V�����͎w��s��
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
			if(tmpChar!="'" && tmpChar!='"')	// �N�H�[�e�[�V�����ނ͎g�p�s��
				srcAry.push(tmpChar);
		}
	}
	aryLen = srcAry.length;
	for(var i = 0; i < len; i++){
		resStr += srcAry[Math.floor(Math.random()*aryLen)];
	}
	return resStr;
}

// ���ݒ�̓��������
// �u�S�u���v�u�w�蕶�����̃����_��������𐶐��v���K�v
// ���C����ʂ��W��_�Ƃ��Ĉ����A��������v���t�B�[����ʂƐݒ��ʁA�ʒm�|�b�v�A�b�v�Ɋg�U����
// ��������P�̂̃I�u�W�F�N�g�ɂ��āA��L�̃v���p�e�B���܂߂�`�ɂ��邱�Ƃ��\
// 	srcWindow�F���̉�ʁB�N�_�̉�ʂŎw��B_Janetter_Window_Type �Ŏ擾�ł���̂Ɠ������́B�K�{�i�I�u�W�F�N�g�n���̏ꍇ�A�����ŕ₤���߂Ȃ��Ă��ǂ��j
// 	isSrcProfile�F�v���t�B�[����ʂ��N�_�Ɏ��s����ۂɁAtrue ���w�肷��itrue/false�j�B�v���t�B�[����ʂŎ��s����ꍇ�ɂ͕K�{�i�I�u�W�F�N�g�n���̏ꍇ�A�����ŕ₤���߂Ȃ��Ă��ǂ��j�Bmain �� profile �ŋ��ʂ��Ď��s����ꍇ��(_Janetter_Window_Type=='profile')���w�肷��Ɗy
// 	configName�F�ۑ��������ݒ荀�ڂ̖��́B�K�{
// 	configData�F�ۑ��������ݒ荀�ڂ̃f�[�^�B�K�{
// 	configIsBoole�F�ۑ��������ݒ荀�ڂ̃f�[�^�� Boolean ���ǂ����itrue/false�j�B���w��̏ꍇ�� false �����B�I�u�W�F�N�g�n���̏ꍇ�A�����ŕ₤�̂ŕs�v
// 	funcExecOnMain�F�������������Ƀ��C����ʂŎ��s����֐����i������Ŏw��j
// 	funcExecOnProf�F�������������Ƀv���t�B�[����ʂŎ��s����֐����i������Ŏw��j
// 	funcExecOnConf�F�������������ɐݒ��ʂŎ��s����֐����i������Ŏw��j
// 	funcExecOnNotice�F�������������ɒʒm�|�b�v�A�b�v��ʂŎ��s����֐����i������Ŏw��j
// 	dontSave�F���C����ʂŕۑ������Ȃ��itrue/false�j�B�����̐ݒ荀�ڂ̓��������ꍇ�ȂǘA������ syncConfig ��������ꍇ�Ɏg��
// 	profTrack�F�v���t�B�[����ʂŎ��s�����Ƃ��A���C����ʂ���̖߂���g���b�L���O���邽�߂̕�����B�����������邽�߁A�ʏ�͎w��Ȃ�
// ���ufuncExecOn�`�v�̊֐��Ɉ����͓n���Ȃ��̂ŁA�������s�v�Ȍ`�ɂ��Ă�������
// �����̕ϐ����K�v
var isSrcProfileWindow = {};
syncConfig = function(srcWindow, isSrcProfile, configName, configData, configIsBoole, funcExecOnMain, funcExecOnProf, funcExecOnConf, funcExecOnNotice, dontSave, profTrack){
	var dataIsEmpty = (configData==undefined),
		lackSrcProfile = (srcWindow=='profile' && isSrcProfile==undefined);
	// �������I�u�W�F�N�g�̏ꍇ�ɁA�ϐ��ɓW�J
	if(typeof arguments[0]=='object'){
		isSrcProfile = arguments[0].isSrcProfile || (_Janetter_Window_Type=='profile');	// �I�u�W�F�N�g�ň������n�����ꍇ�̓��[�U�[�w��ƌ��Ȃ��Ďw�肪�Ȃ��Ă��₤
		configName = arguments[0].configName || '';
		configData = arguments[0].configData;
		dataIsEmpty = (arguments[0].configData==undefined);
		configIsBoole = arguments[0].configIsBoole || (typeof configData == 'boolean');
		funcExecOnMain = arguments[0].funcExecOnMain || '';
		funcExecOnProf = arguments[0].funcExecOnProf || '';
		funcExecOnConf = arguments[0].funcExecOnConf || '';
		funcExecOnNotice = arguments[0].funcExecOnNotice || '';
		dontSave = arguments[0].dontSave || false;
		profTrack = '';	// profTrack �͎����������邽�߁A�I�u�W�F�N�g�ň������n�����ꍇ�̓��[�U�[�w��ƌ��Ȃ��Ďw��Ȃ�
		srcWindow = arguments[0].srcWindow || _Janetter_Window_Type;	// srcWindow �� arguments[0] �Ȃ̂Ō�񂵁B�I�u�W�F�N�g�ň������n�����ꍇ�̓��[�U�[�w��ƌ��Ȃ��Ďw�肪�Ȃ��Ă��₤
	}
	// �K�{���ڂ̃`�F�b�N
	if(!srcWindow){
		console.warn('syncConfig�FsrcWindow ���s�����Ă��܂��B');
		return false;
	}
	if(!configName){
		console.warn('syncConfig�FconfigName ���s�����Ă��܂��B');
		return false;
	}
	if(dataIsEmpty){
		console.warn('syncConfig�FconfigData ���s�����Ă��܂��B');
		return false;
	}
	if(lackSrcProfile){
		console.warn('syncConfig�FisSrcProfile ���s�����Ă��܂��B');
		return false;
	}
	// isSrcProfile �� configIsBoole�AdontSave �� webViewAction �ł̈����n������
	// Boolean �� String �ɕϊ�����Ă���P�[�X�����邽�߁A�␳����
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
	// �����n���p�f�[�^�� configData �ɁA�ۑ��p�f�[�^�� configDataSave �ɕ�����
	var configDataSave = configData;
	// webViewAction �ł̈����n������ Boolean �� String �ɕϊ�����Ă���P�[�X�����邽�߁A
	// configIsBoole �ŗ^����ꂽ���ɉ����ĕۑ��p�f�[�^��␳����
	configDataSave = (configIsBoole && typeof configDataSave=='string') ?
						(configDataSave=='true') ?
							true :
							false :
						configDataSave;
	// �ۑ��p�f�[�^��������̏ꍇ�A�_�u���N�H�[�e�[�V�������G���R�[�h�i�������̎Q�Ɖ��j/�f�R�[�h����
	// ���̃f�[�^�� Boolean �̃P�[�X�͏�L�őI�ʂ��������Ă���̂ŋC�ɂ��Ȃ��ėǂ�
	if(typeof configDataSave=='string'){
		if((srcWindow=='profile'&&isSrcProfile)||(srcWindow!='profile'&&srcWindow==_Janetter_Window_Type)){
			// �f�[�^�������n���ꍇ
			// �E���̃E�B���h�E�� profile �ŁA�N�_�̃E�B���h�E�̏ꍇ
			// �@or
			// �E���̃E�B���h�E�� profile �ł͂Ȃ��āA���̃E�B���h�E�ƌ��݂̃E�B���h�E����v����ꍇ
			// �����n���p�f�[�^�iconfigData�j���G���R�[�h����
			configData = configData.replaceAll('&','&amp;').replaceAll('"','&quot;');
			// �ۑ��p�f�[�^�͐��̏�ԂȂ̂ŃG���R�[�h�̕K�v�Ȃ�
		} else {
			// �f�[�^�������n����Ă����ꍇ
			// �E���̃E�B���h�E�� profile �ŁA�N�_�̃E�B���h�E�ł͂Ȃ��ꍇ
			// �@or
			// �E���̃E�B���h�E�ƌ��݂̃E�B���h�E����v���Ȃ��ꍇ
			// ��profile ���N�_�̃E�B���h�E�������ꍇ�ɂ́A�f�[�^�̈����n�����_��
			// �@isSrcProfile �� false �ɐݒ肵�Ă���̂ŁA�����n����鑤�ł������
			// �@�����ɓK�����邱�Ƃ͂��蓾�Ȃ�
			// �ۑ��p�f�[�^�iconfigDataSave�j���f�R�[�h����
			configDataSave = configDataSave.replaceAll('&quot;','"').replaceAll('&amp;','&');
			// �����n���p�f�[�^�̓G���R�[�h���ꂽ��Ԃ̂܂܃p�X�X���[����
		}
	}
	// �w�肳�ꂽ�ݒ荀�ڂɕۑ��p�f�[�^������
	jn.conf[configName] = configDataSave;
	// �E�B���h�E���Ƃ̏���
	switch(_Janetter_Window_Type){
		case 'main':
			// ���݂̃E�B���h�E�����C���̏ꍇ�̂݁AdontSave �� true �łȂ���΃f�[�^��ۑ�����
			if(!dontSave)
				jn.setConfig(jn.conf);
			// �ȉ��Amain �ɗ��Ă���i�K�ŁAisSrcProfile �͕K�� false�AdontSave ���l���̕K�v�Ȃ�
			// ���ׂāA�����n����̃E�B���h�E�͏I�[�Ȃ̂ŁA�Y������֐��ȊO�͈����n���Ȃ�
			// ���̃E�B���h�E�^�C�v���ǂ�ł����Ă��Aprofile �ɂ͂���Ȃ������n��
			jn.webViewAction('profJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","'+funcExecOnProf+'","","",'+false+',"'+profTrack+'")'});
			// ���̃E�B���h�E�^�C�v�� config �łȂ���΁Aconfig �Ɉ����n��
			if(srcWindow!='config')
				jn.webViewAction('confJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","'+funcExecOnConf+'","",'+false+',"'+profTrack+'")'});
			// ���̃E�B���h�E�^�C�v�� notice �łȂ���΁Anotice �Ɉ����n��
			if(srcWindow!='notice')
				jn.webViewAction('noticeJS', {cmd:'syncConfig("'+srcWindow+'",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"","","","'+funcExecOnNotice+'",'+false+',"'+profTrack+'")'});
			if(srcWindow!='main' && funcExecOnMain)	// ���g���N�_�̏ꍇ�� funcExecOnMain �͎��s���Ȃ�
				eval(funcExecOnMain+'()');
			break;
		case 'profile':
			// profile �́A���g�̃E�B���h�E�ȊO�ɁA�����^�C�v�̃E�B���h�E�����ɑ��݂���P�[�X������
			// main ���o�R���đ��̃E�B���h�E�Ɋg�U�����邪�A���̉ߒ��� main ���玩�g�ɂ��߂��Ă��邱�Ƃ��l��
			if(srcWindow=='profile' && isSrcProfile){	// ���g�����M���̏ꍇ�̏�����s�B�t���O�𗧂Ă� main �Ɉ����n��
				var trackStr = randomStr(10);
				isSrcProfileWindow[trackStr] = true;
				jn.webViewAction('mainJS', {cmd:'syncConfig("profile",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","'+funcExecOnNotice+'",'+dontSave+',"'+trackStr+'")'});
			}
			if((srcWindow!='profile' || (profTrack!='' && !isSrcProfileWindow[profTrack])) && funcExecOnProf)	// ���g���N�_�̏ꍇ�� funcExecOnProf �͎��s���Ȃ�
				eval(funcExecOnProf+'()');
			if(!isSrcProfile && isSrcProfileWindow[profTrack])	// ���g�����M���̏ꍇ�̖߂�́A�t���O�����ɖ߂�
				isSrcProfileWindow[profTrack] = false;
			break;
		case 'config':
			if(srcWindow == 'config')	// ���g�����M���̏ꍇ�̂� main �Ɉ����n��
				jn.webViewAction('mainJS', {cmd:'syncConfig("config",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","","'+funcExecOnNotice+'",'+dontSave+',"")'});
			else if(funcExecOnConf)	// ���g���N�_�̏ꍇ�� funcExecOnConf �͎��s���Ȃ�
				eval(funcExecOnConf+'()');
			break;
		case 'notice':
			if(srcWindow == 'notice')	// ���g�����M���̏ꍇ�̂� main �Ɉ����n��
				jn.webViewAction('mainJS', {cmd:'syncConfig("notice",'+false+',"'+configName+'","'+configData+'",'+configIsBoole+',"'+funcExecOnMain+'","'+funcExecOnProf+'","'+funcExecOnConf+'","",'+dontSave+',"")'});
			else if(funcExecOnNotice)	// ���g���N�_�̏ꍇ�� funcExecOnNotice �͎��s���Ȃ�
				eval(funcExecOnNotice+'()');
			break;
	}
	return true;
};

// ��syncConfig �R�����g������
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
		console.warn('syncConfig�FsrcWindow ���s�����Ă��܂��B');
		return false;
	}
	if(!configName){
		console.warn('syncConfig�FconfigName ���s�����Ă��܂��B');
		return false;
	}
	if(dataIsEmpty){
		console.warn('syncConfig�FconfigData ���s�����Ă��܂��B');
		return false;
	}
	if(lackSrcProfile){
		console.warn('syncConfig�FisSrcProfile ���s�����Ă��܂��B');
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

// �����b�Z�[�W�̖|��f�[�^��ǉ�
// msg �͂��̉��ɘA�z�z��� en �� ja �Ȃǂ̌���R�[�h�ʂɕ����񃊃\�[�X���A����ɘA�z�z��Ƃ��Ď����Ă��邱�Ƃ��O��
// ���p���@�� @ginlime �̃v���O�C�����Q�Ƃ̂��Ɓijanet.onGetMessages ���������āA�I���W�i���̎��s�O�Ɏ��s����j
// additionalProc �Ɋ֐����w�肷�邱�ƂŁA�Ⴆ�Γ���̃f�[�^�� format ����Ƃ������悤�ȉ��H���\
addTranslateData = function(msg, additionalProc){
	var msgData = msg[jn.conf.lang];
	if(msgData == undefined)
		msgData = msg['en'];
	additionalProc && additionalProc(msgData);
	assignTo(jn.msg, msgData);
};

// �����l�������œ��ꂽ�z��ɑ΂��A�w�肵���l���ǂ� index �̊Ԃɂ���A
// ���͈̔͂ł̔䗦�͂����Ȃ̂�
// �߂�l�Fobject
// �@�@�@�@start�F�J�n index
// �@�@�@�@end�F�I�� index
// �@�@�@�@ratio�F�䗦
// �͈͊O�̏ꍇ�́A���ׂ� -1 �ŕԂ�
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

// ���䗦��l�܂��͔z��ɓK�p����
// �ΏۂƂȂ�l�̌^�͓���ł��邱�Ƃ�O��Ƃ��A�z��̒���������ł�����̂Ƃ���
// �߂�l�͂��ׂĐ����ɂȂ�
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

// ��Object �̎q�v�f���i�A�z�z��̗v�f���j
objectLength = function(obj){
	var cnt = 0;
	$.each(obj, function(){
		cnt++;
	});
	return cnt;
};

// ���I�[�o�[���C�t���̃v���O���X�o�[��\������ jquery.ui.progressOverlay
// jquery.ui.dialog �� jquery.ui.progressbar ���Q�l�ɍ쐬
// Janetter �� Chrome �x�[�X�̂��߁AIE6 �͊��S�ɖ������Ă���̂ŁA
// �ڐA�Ȃǂ��ăN���X�u���E�U�Ŏg���ꍇ�ɂ͒���
// ���ۂ̎g�p��́A�ꊇ�u���b�N�v���O�C�����Q�Ƃ̂���

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
		closeOnEscape: false,	// �f�o�b�O�p
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
// jquery.ui.progressOverlay �����܂�

})(jQuery, janet);
