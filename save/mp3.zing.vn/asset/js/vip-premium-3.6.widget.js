/*java script*/
var ver='vip-premium-3.6.widget',verJq='2.1.0',lib='jquery';
var ZVip={
	browserIE:true,
	boxOption:null,
	boxCredit:null,
	box123pay:null,
	boxPackage:null,
    boxPaymentMethod: null,
    boxDBValues: null,
	box:null,
	packages:0,
    pMethod: null,
	payback:1,
	vip:0,
	isVip:0,
	inited:0,
	styleMain:null,
	init: function(){
		ZPayment.init(MP3.LABEL_URL);
        //VIP expired warning - show after 5 seconds since page loaded
        if (MP3.VIP_EXPIRE && MP3.ACCOUNT_ID) {
            var expire = MP3.VIP_EXPIRE;
            var now = new Date().getTime()/1000;
            var secondOfDay = 24*3600;
            var days_remain = Math.ceil((expire - now)/secondOfDay);
            if (days_remain <= 7 && days_remain >= -1) {
                var days_expire = new Date(expire*1000).toLocaleDateString('vi', 'dd/mm/yyyy');
                var now_string = new Date().toLocaleDateString('vi', 'dd/mm/yyyy');
                //Browser do not support localStorage
                if (window.localStorage == undefined) {
                    return;
                }
                setTimeout(function() {
                    var cookie = window.localStorage.getItem('warning_day');
                    if (cookie && cookie.indexOf(MP3.ACCOUNT_ID + now_string) != -1) {
                        return;
                    }
                    ZVip.FMessage(2, days_remain, days_expire);
                    //Write localStorage to restrict the same warning.
                    if (cookie) {
                        cookie += ',' + MP3.ACCOUNT_ID + now_string;
                    } else {
                        cookie = MP3.ACCOUNT_ID + now_string;
                    }
                    window.localStorage.setItem('warning_day', cookie);
                }, 5000);
            }
        }
		if(typeof Login==='undefined' && typeof zmp3Login!=='undefined') Login=zmp3Login;
		var u=gParam('u'),params=[];
		if(u && u === MP3.ACCOUNT_ID){
			if(Login.show()){
				var mtransID=gParam('mt'),app=gParam('app'),succ=gParam('succ');
				params.push('u='+u);
				if(mtransID && app){
					params.push('u='+u);
					params.push('mt='+mtransID);
					params.push('transactionID='+gParam('transactionID'));
					params=params.join('&');
					switch(app.toLowerCase()){
						case '123pay':
						{
							var uReport=MP3.LABEL_URL + ZPayment._123pay_report+'?'+params+'&callback=?';
                            alert(uReport);
							$.ajax({
								type:'JSON',url:uReport,
								dataType:'json',contentType:'text/javascript;charset=UTF-8',
								success:function(report){
									if(typeof report === 'object'){
										var html='';
										if(typeof report.error_code !=='undefined'){
											if(parseInt(report.error_code) === 0){
												html += '<div class="overlay">'+
															'<div class="box-popup no-padding">'+
																'<div class="popup-content">'+
																	'<p class="mb20"><strong>Giao dịch thành công</strong></p>'+
																	'<p class="text-3 lh18 block-center">Cám ơn bạn đã sử dụng dịch vụ Zing Mp3 VIP.</p>'+
																'</div>'+
															'</div>'+
														'</div>';
												Boxy.show(
													html,{title:'',okButton:'Đóng'},
													function onOk(){
														window.location.href = MP3.MP3_URL+'/vip';
													}
												);
											}else{
												html += '<div class="overlay">'+
															'<div class="box-popup no-padding">'+
																'<div class="popup-content">'+
																'<p class="mb20"><strong>Giao dịch thất bại</strong></p>'+
																'<p class="text-3 lh18 block-center">Giao dịch thất bại do: '+report.error_message+'</p>'+
																'<p class="text-3 lh18 block-center">Gọi <strong>1900 561 558</strong> để được hỗ trợ thêm.</p>'+
																'</div>'+
															'</div>'+
														'</div>';
												Boxy.show(
													html,{title:'',okButton:'Đóng'},
													function onOk(){
														window.location.href = MP3.MP3_URL+'/vip';
												});
											}
										}
									}
								}
							});
							break;
						}
					}
				}
			}
		}
		$('._btnAct').click(function(){
			if(Login.show()){
				var oBtn=$(this);
				if(oBtn.attr('package')){
					var field = oBtn.attr('package'),params=[];
					params[$(this).attr('_ffield')] = $(this).attr('package');
					ZVip.Foption(params);
				}
			}
			return false;
		});
	},
	Foption:function(params){
		ZVip.boxOption=null;
		var html =	'';
			html += '<div class="overlay">'+
						'<div class="box-popup no-padding">'+
							'<div class="popup-content">'+
								'<p class="mb20"><strong>Chọn kênh thanh toán</strong></p>'+
								'<div class="box-payment first">'+
									'<input type="radio" class="fzme rdb" id="rdo_zingxu" name="zingpay" value="zingxu" />'+
									'<label for="rdo_zingxu">&nbsp;Zing Xu</label>'+
									'<span class="fzme payment" val="fzme"></span>'+
								'</div>'+
								'<div class="box-payment">'+
									'<input type="radio" class="fpay rdb" id="rdo_123pay" name="zingpay" value="123pay" />'+
									'<label for="rdo_123pay">&nbsp;Internet Banking</label>'+
									'<span class="fpay payment" val="fpay"></span>'+
								'</div>'+
							'</div>'+
							'<span class="close"></span>'+
						'</div>'+
					'</div>';
		ZVip.boxOption=Boxy.show(
			html,{title:'',okButton:'Tiếp tục', 
			afterShow:function(){
				$('span.payment').click(function(){
					var mclass = '.'+$(this).attr('val');
					$("input[name='zingpay']").removeAttr('checked').filter(mclass).prop('checked',true);
					switch($("input[name='zingpay']:checked").val()){
						case 'zingxu': ZPayment.FViZingMe(params);ZVip.boxOption.hide();break;
						case '123pay': ZPayment.FSelectBanks(params);ZVip.boxOption.hide();break;
					}
				});
			}},
			function onOk(){
				var pay=$("input[name='zingpay']:checked").val(),res=false;
				switch(pay){
					case 'zingxu': ZPayment.FViZingMe(params);res=true;break;
					case '123pay': ZPayment.FSelectBanks(params);res=true;break;
				}
				return res;
			});
	},
	Foption1:function(params){
		ZVip.boxOption=null;
		var html =	'';
			html += '<div class="overlay">'+
						'<div class="box-popup no-padding">'+
							'<div class="popup-content">'+
								'<p class="mb20"><strong>Chọn kênh thanh toán</strong></p>'+
								'<div class="box-payment first">'+
									'<input type="radio" class="fzme rdb" id="rdo_zingxu" name="zingpay" value="zingxu" />'+
									'<label for="rdo_zingxu">&nbsp;Zing Xu</label>'+
									'<span class="fzme payment" val="fzme"></span>'+
								'</div>'+
								'<div class="box-payment">'+
									'<input type="radio" class="fpay rdb" id="rdo_123pay" name="zingpay" value="123pay" />'+
									'<label for="rdo_123pay">&nbsp;Internet Banking</label>'+
									'<span class="fpay payment" val="fpay"></span>'+
								'</div>'+
							'</div>'+
							'<span class="close"></span>'+
						'</div>'+
					'</div>';
		ZVip.boxOption=Boxy.show(
			html,{title:'',okButton:'Tiếp tục',cancelButton:'Trở lại', 
			afterShow:function(){
				$('span.payment').click(function(){
					var mclass = '.'+$(this).attr('val');
					$("input[name='zingpay']").removeAttr('checked').filter(mclass).prop('checked',true);
					switch($("input[name='zingpay']:checked").val()){
						case 'zingxu': ZPayment.FViZingMe(params,true);ZVip.boxOption.hide();break;
						case '123pay': ZPayment.FSelectBanks(params,true);ZVip.boxOption.hide();break;
					}
				});
			}},{
			onOk:function(){
				var pay=$("input[name='zingpay']:checked").val(),res=false;
				switch(pay){
					case 'zingxu': ZPayment.FViZingMe(params,true);res=true;break;
					case '123pay': ZPayment.FSelectBanks(params,true);res=true;break;
				}
				return res;
			},
			onCancel:function(event){
				ZVip.Fpackagedo();
			}});
	},
	Fpackage:function(option){
		if(typeof Login==='undefined' && typeof zmp3Login!=='undefined') Login=zmp3Login;
		if(Login.show()){
			status=null;
			ZVip.packages=0;
			if(typeof option === 'undefined') option=1;
			switch(option){
				case 1: ZVip.Fstatus(status);break;
				//case 2: ZVip.Fpackagedo();break;
                case 2: ZVip.FpaymentMethod();break;
                case 3: ZVip.FpaymentMethod(true);break;
                case 4: ZPayment.FDirectBillingPay();break;
			}
		}
	},
    //Update by trucnd on 1/6/16, choose payment method before package
    FpaymentMethod: function(type) {
        ZVip.boxPaymentMethod=null;
        ZVip.packages= 0;
        var html =	'';
        var html_telcard = '<div class="box-payment first">'+
                            '<input type="radio" class="telcard rdb" id="rdo_telcard" name="zingpay" value="telcard" />'+
                            '<label for="rdo_telcard">&nbsp;Thẻ cào điện thoại</label>'+
                            '<span class="telcard payment" val="telcard"></span>'+
                            '</div>';
        html += '<div class="overlay">'+
            '<div class="box-popup no-padding">'+
            '<div class="popup-content">'+
            '<p class="mb20"><strong>Chọn kênh thanh toán</strong></p>'+
            (type != undefined?'':html_telcard) +
            '<div class="box-payment first">'+
            '<input type="radio" class="fzme rdb" id="rdo_zingxu" name="zingpay" value="zingxu" />'+
            '<label for="rdo_zingxu">&nbsp;Zing Xu</label>'+
            '<span class="fzme payment" val="fzme"></span>'+
            '</div>'+
            '<div class="box-payment">'+
            '<input type="radio" class="fpay rdb" id="rdo_123pay" name="zingpay" value="123pay" />'+
            '<label for="rdo_123pay">&nbsp;Internet Banking</label>'+
            '<span class="fpay payment" val="fpay"></span>'+
            '</div>'+
            '</div>'+
            '<span class="close"></span>'+
            '</div>'+
            '</div>';
        ZVip.boxPaymentMethod=Boxy.show(
            html,{title:'',okButton:'Tiếp tục',
                afterShow:function(){
                    $('span.payment').click(function(){
                        var mclass = '.'+$(this).attr('val');
                        $("input[name='zingpay']").removeAttr('checked').filter(mclass).prop('checked',true);
                        ZVip.pMethod = $("input[name='zingpay']:checked").val();
                        ZVip.boxPaymentMethod.hide();
                        switch(ZVip.pMethod){
                            case 'zingxu': case '123pay': ZVip.Fpackagedo();break;
                            case 'telcard': ZPayment.FDirectBillingPay();break;
                        }
                    });
                }},
            function onOk(){
                var pay=$("input[name='zingpay']:checked").val(),res=false;
                ZVip.pMethod = $("input[name='zingpay']:checked").val();
                ZVip.boxPaymentMethod.hide();
                if (!pay) {
                    alert("Vui lòng chọn phương thức thanh toán");
                }
                switch(pay){
                    case 'zingxu': case '123pay': ZVip.Fpackagedo();break;
                    case 'telcard': ZPayment.FDirectBillingPay();break;
                }
                return res;
            });
    },
    //end update
	Fpackagedo:function(){
		var html = '';
			html += '<div class="overlay">'+
						'<div class="box-popup no-padding">'+
							'<div class="popup-content">'+
								'<p class="mb20"><strong>Chọn gói dịch vụ</strong></p>'+
								'<ul class="list-package">'+
									'<li val="1" class="child-1">'+'<div class="type-package">01<span>tháng</span></div>'+'<div class="type-price" val="1">30.000</div>'+'</li>'+
									'<li val="3" class="child-2">'+'<div class="type-package">03<span>tháng</span></div>'+'<div class="type-price" val="3">80.000</div>'+'</li>'+
									'<li val="6" class="child-3">'+'<div class="type-package">06<span>tháng</span></div>'+'<div class="type-price" val="6">150.000</div>'+'</li>'+
									'<li val="12" class="child-4">'+'<div class="type-package">12<span>tháng</span></div>'+'<div class="type-price" val="12">270.000</div>'+'</li>'+
								'</ul>'+
							'</div>'+
							'<span class="close"></span>'+
						'</div>'+
					'</div>';
			ZVip.boxPackage = Boxy.show(
				html,{title:'', cancelButton: "Trở lại",
				afterShow:function(){
					$('.list-package').bind('click', function(event) {
						var target=event.target,val=$(target).attr('val');
						$(this).children('li').each(function(index) {
							if($(this) !==$(target)){
								$(this).removeClass('active');
								var tagI=$(this).find('i');
								if(tagI && typeof tagI!=='undefined' )tagI.remove();
							}
						});
						if(target.tagName.toLowerCase()==='div'){
							$(target).parent().addClass('active');
							ZVip.packages=parseInt($(target).parent().attr('val'));
							switch($(target).attr('class')){
								case 'type-package':break;
								case 'type-price':break;
							}
						}else if(target.tagName.toLowerCase()==='li'){
							$(target).addClass('active');
						}
						if(ZVip.packages){
							var params=[];
							params['package']=ZVip.packages;
							params['payback']=encodeURIComponent(ZVip.payback);
							params['popup']=1;
							ZVip.boxPackage.hide();ZVip.boxPackage=null;
                            switch(ZVip.pMethod){
                                case 'zingxu': ZPayment.FViZingMe(params,true);break;
                                case '123pay': ZPayment.FSelectBanks(params,true);break;
                            }
							//ZVip.Foption1(params);
						}
					});
				}}, {
                    onCancel: function() {
                        ZVip.boxPackage.hide();
                        ZVip.FpaymentMethod();
                    }
                }
			);
	},
	Fstatus:function(status){
		if(typeof MP3.VIP!=='undefined' && MP3.VIP) status=MP3.VIP;
		var params=[],data=null;
		params.push('u='+MP3.ACCOUNT_ID);
		data=params.join('&');
		switch(status){
			case 1:
				ZVip.Fpackagedo();break;
			case 0:case -1:
				ZVip.Fextension(status);break;
			default:
			{
				$.ajax({
					url:ZPayment.domain+ZPayment._vip_status+'?'+'&callback=?',
					type:'GET',async:false,
					crossDomain:true,contentType:'text/javascript;charset=utf-8',
					data:data,dataType:'json',
					success:function(res){
						if(typeof res.status!=='undefined'){
							status=res.status;ZVip.Fstatus(status);
						}
					},
					error:function(req,txtStatus,thrown){
						status=-1;ZVip.Fstatus(status);
					}
				});
			}
		}
	},
	Fextension:function(status){
		var html='',txtOk='Đồng ý',txtCancel='Bỏ qua';
		switch(status){
			case 0:
			{
				txtOk='Gia hạn';
				html+=	'<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+'<p class="mb20"><img src="http://static.mp3.zdn.vn/skins/zmp3-v4.1/images/icon-king.png" alt="Zing Mp3" /></p>'+'<p class="text-3 lh18 block-center">Chức năng đặc biệt dành riêng cho tài khoản VIP.<br />Vui lòng gia hạn tài khoản VIP để sử dụng chức năng này.</p>'+'</div>'+
								'<span class="close"></span>'+
							'</div>'+
						'</div>';
				break;
			}
			case -1:
			{
				txtOk='Nâng cấp';
				html+=	'<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+'<p class="mb20"><img src="http://static.mp3.zdn.vn/skins/zmp3-v4.1/images/icon-king.png" alt="Zing Mp3" /></p>'+'<p class="text-3 lh18 block-center">Chức năng đặc biệt dành riêng cho tài khoản VIP.<br/>Nâng cấp tài khoản VIP để trải nghiệm không gian âm nhạc đẳng cấp.</p>'+'</div>'+
								'<span class="close"></span>'+
							'</div>'+
						'</div>';
			}
		}
		Boxy.show(
			html,{title:'',cancelButton:txtCancel,okButton:txtOk},
			function onOk(){ZVip.FpaymentMethod(); }
		);
	},
	FValPackage:function(params){
		var value='';
		if(typeof(params['package'])!=='undefined'){
			switch( parseInt(params['package']) ){
				case 1: value='30.000';break;
				case 3: value='80.000';break;
				case 6: value='150.000';break;
				case 12: value='270.000';break;
			}
		}
		return value;
	},
	FMessage:function(status,message, param){
		switch(status){
			case 1:
				var msg='',html='';
				if(message!==undefined) msg=message;
				else msg='Cám ơn bạn đã sử dụng dịch vụ VIP của Zing Mp3. <br>Vui lòng đăng nhập lại để kích hoạt.';
				html += '<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+
									'<p class="mb20"><strong>Giao dịch thành công</strong></p>'+
									'<p class="text-3 lh18 block-center">'+msg+'</p>'+
								'</div>'+
								'<div class="popup-footer">'+
									'<p class="info-more"><a href="http://mp3.zing.vn/vip">Tìm hiểu thêm về ưu đãi cho VIP</a></p>'+
								'</div>'+
							'</div>'+
						'</div>';
				Boxy.show(
					html,{title:'',okButton:'Đóng'},
					/*afterShow:function(){this.resize(390, 250).resetHeight()}},*/
					function onOk(){}
				);
				break;
			case 0:
				var msg='',html='';
				if(message!==undefined) msg=message;
				else msg='Mọi chi tiết giải đáp thắc mắc. <br>Bạn vui lòng liện hệ Website: <a href="http://hotro.zing.vn"><strong>Hỗ trợ</strong></a> hay Hotline:1900 561 558.';
				html += '<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+
									'<p class="mb20"><strong>Giao dịch thất bại</strong></p>'+
									'<p class="text-3 lh18 block-center">'+msg+'</p>'+
								'</div>'+
								'<span class="close"></span>'+
							'</div>'+
						'</div>';
				Boxy.show(
					html,{title:'',okButton:'Đóng'},
					function onOk(){}
				);
				break;
            case 2:
                var html = '';
                var msg_p1 = "Tài khoản VIP của bạn chỉ còn <strong>" + message + "</strong\>";
                if (message < 0) {
                    msg_p1 = "Tài khoản VIP của bạn đã hết";
                }
                var msg = msg_p1 + " ngày sử dụng (ngày hết hạn: <strong>" + param +"</strong\>). " +
                    "<br> Gia hạn tài khoản ngay hôm nay để tiếp tục nhận " + "<a style='color: #721799' href='/vip/thu-vien-nhac-vip/'>ưu đãi VIP</a>";
                html += '<div class="overlay">'+
                    '<div class="box-popup no-padding">'+
                    '<div class="popup-content">'+
                    '<p class="text-3 lh18 block-center">'+msg+'</p>'+
                    '</div>'+
                    '<span class="close"></span>'+
                    '</div>'+
                    '</div>';
                Boxy.show(
                    html,{title:'',okButton:'Gia hạn', cancelButton: "Để sau"},
                    function onOk(){
                        ZVip.FpaymentMethod();
                    }
                );
                break;
		}
	}
};
var ZPayment={
	domain: null,
	_123pay_createOrder:'vip/123pay/create-order',
    _directBilling_createOrder:'vip/direct-billing/create-order',
	_123pay_report:'vip/123pay/report',
	_viZingme:'vip/vi-zingme',
	_vip_regist:'vip/dang-ky',
	_vip_status:'vip/status',
	boxBank:null,
	boxPayBank:null,
    boxTelcardValue: null,
    boxPayTelcard: null,
	callback:0,
	init:function(domain){
		this.domain=domain;
        //this.domain = "http://dev.label.mp3.zing.vn/";
	},
	FVipUsed:function(params){
		$.ajax({
			type:'JSON',url:ZPayment.domain+ZPayment._vip_used+'?'+params+'&callback=?',
			async: false,
			dataType:'jsonp',contentType:'text/javascript;charset=UTF-8',
			success:function(order){
				if(typeof order==='object'){
					if(parseInt(order.error_code)===0 && typeof order.redirect!=='undefined'){
						if(typeof popup!=='undefined' && popup){
							switch(popup){
								case 1:
									var boxwidth=850,boxheight=560;
									var html='';
									html += '<div class="overlay">'+
												'<div class="box-popup no-padding">'+
													'<div class="popup-content">'+
														'<p class="mb20"><strong>&nbsp;</strong></p>'+
														'<div>'+
															'<iframe id="credit" marginwidth="0" marginheight="0" align="top" hspace="0" vspace="0" width="'+boxwidth+'px" height="'+boxheight+'px" frameBorder="0" src="'+order.redirect+'" ></iframe>'+
														'</div>'+
													'</div>'+
													'<span class="close"></span>'+
												'</div>'+
											'</div>';
									Boxy.show(html,{title:'',modal:true});
									break;
								case 2:
									$(href).attr('href',order.redirect);
									href.click();
									/*form.attr('action','http://tv.zing.vn');//form.submit();*/
									break;
								default:
									window.location.href=order.redirect;
									break;
							}
						}else{
							window.location.href=order.redirect;
						}
					}else{
						ZPayment.FMessage(0);
					}
				}
			},error: function(XMLHttpRequest, status, erThrown){
				ZPayment.boxBank.hide();
				ZPayment.FMessage(0);
			},complete:function(XMLHttpRequest, textStatus){
				return true;
			}
		});
	},
	FSelectBanks:function(params,back){
		ZPayment.boxBank=null;
		if(params === undefined) var params=[]; val=ZVip.FValPackage(params);
		if(val){ val='<p>Thanh toán gói dịch vụ Zing Mp3 VIP '+params['package']+' tháng ('+val+'đ)</p>'; }
		var html ='';
			html += '<div class="overlay">' +
						'<div class="box-popup no-padding">'+
							'<div class="popup-content">'+
								'<p class="mb20"><strong>Chọn ngân hàng</strong><br />Thẻ ATM có Internet Banking (miễn phí)</p>'+
								val+
								'<div id="payment-status" class="payment-status none"><img src="http://stc-tv.zing.vn/skins/tv_v2/images/loading.gif">Hệ thống đang xử lý ....</div>'+
								'<div class="z-payment z-payment-ifrm none1">'+
									'<div class="pack-service choose-bank">'+
										'<div class="outside-service">'+
											'<ul>'+
												'<li><input type="radio" class="rdb" name="banks" id="vtb" value="vtb" /><label for="vtb" class="vtb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="ocb" value="ocb" /><label for="ocb" class="ocb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="vcb" value="vcb" /><label for="vcb" class="vcb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="tcb" value="tcb" /><label for="tcb" class="tcb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="exb" value="exb" /><label for="exb" class="exb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="vib" value="vib" /><label for="vib" class="vib"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="mbb" value="mbb" /><label for="mbb" class="mbb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="acb" value="acb" /><label for="acb" class="acb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="hdb" value="hdb" /><label for="hdb" class="hdb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="scb" value="scb" /><label for="scb" class="scb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="nvb" value="nvb" /><label for="nvb" class="nvb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="mrb" value="mrb" /><label for="mrb" class="mrb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="vab" value="vab" /><label for="vab" class="vab"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="vpb" value="vpb" /><label for="vpb" class="vpb"></label></li>'+
                                                '<li><input type="radio" class="rdb" name="banks" id="bab" value="bab" /><label for="bab" class="bab"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="bab" value="bab" /><label for="bab" class="bab"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="gpb" value="gpb" /><label for="gpb" class="gpb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="dab" value="dab" /><label for="dab" class="dab"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="sgb" value="sgb" /><label for="sgb" class="sgb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="arb" value="arb" /><label for="arb" class="arb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="nab" value="nab" /><label for="nab" class="nab"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="bib" value="bib" /><label for="bib" class="bib"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="pgb" value="pgb" /><label for="pgb" class="pgb"></label></li>'+
												'<li><input type="radio" class="rdb" name="banks" id="ccb" value="ccb" /><label for="ccb" class="ccb"></label></li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
							'<span class="close"></span>'+
						'</div>'+
					'</div>';
		ZPayment.boxBank = Boxy.show(html,
			{title:'',okButton:'Xác nhận',cancelButton:'Trở lại',modal:true,
			afterShow:function(){
				this.resize(840, 433).resetHeight();
			}},{
			onOk:function(event){
				var wd=$('#wnBankPay'),res=false;
				banksCode=$("input[type=radio][name='banks']:checked").val();
				if(banksCode){
                    $('#payment-status').removeClass('none');
					params['bank']=banksCode;
                    ZPayment.F123PayBank(params);
				} else {
                    alert("Vui lòng chọn ngân hàng");
                }
				return res;
			},
			onCancel:function(event){
				back = back||false;
                ZVip.FpaymentMethod()
			}});
	},
    //Create order from Direct Billing, @author: trucnd
    FDirectBillingPay: function() {
        var html = '';
        html += '<div class="overlay">'+
            '<div class="box-popup no-padding">'+
            '<div class="popup-content">'+
            '<p class="mb20"><strong>Mệnh giá thẻ và số ngày VIP tương ứng</strong></p>'+
            '<ul class="package-value list-package" style="width: auto">'+
            '<li val="3" style="width: 175px">'+'<div class="type-package">10<span>ngày</span></div>'+'<div class="type-price" val="3">10.000</div>'+'</li>'+
            '<li val="6" style="width: 175px">'+'<div class="type-package">20<span>ngày</span></div>'+'<div class="type-price" val="6">20.000</div>'+'</li>'+
            '<li val="6" style="width: 175px">'+'<div class="type-package">30<span>ngày</span></div>'+'<div class="type-price" val="6">30.000</div>'+'</li>'+
            '<li val="3" style="width: 175px">'+'<div class="type-package">50<span>ngày</span></div>'+'<div class="type-price" val="3">50.000</div>'+'</li>'+
            '<li val="6" style="width: 175px">'+'<div class="type-package">110<span>ngày</span></div>'+'<div class="type-price" val="6">100.000</div>'+'</li>'+
            '<li val="6" style="width: 175px">'+'<div class="type-package">240<span>ngày</span></div>'+'<div class="type-price" val="6">200.000</div>'+'</li>'+
            '<li val="12" style="width: 175px">'+'<div class="type-package">400<span>ngày</span></div>'+'<div class="type-price" val="12">300.000</div>'+'</li>'+
            '<li val="6" style="width: 175px">'+'<div class="type-package">720<span>ngày</span></div>'+'<div class="type-price" val="6">500.000</div>'+'</li>'+
            '</ul>'+
            '</div>'+
            '<span class="close"></span>'+
            '</div>'+
            '</div>';
        ZPayment.boxTelcardValue = Boxy.show(
            html,{title:'', okButton: "Thanh toán", cancelButton: "Trở lại", modal: true,
                afterShow:function(){
                    this.resize(880, 433).resetHeight();
                    $(".package-value li").bind('click', function(){
                        ZPayment.FinputCard();
                    })
                }},
                {
                onOk: function() {
                    ZPayment.FinputCard();
                },
                onCancel: function(){
                    ZVip.FpaymentMethod();
                    Boxy.hidePopup();
                }
            });
    },
    FinputCard: function() {
        $.ajax({
            type: 'JSON', url: ZPayment.domain + ZPayment._directBilling_createOrder,
            //type: 'JSON', url: "http://dev.label.mp3.zing.vn/" + ZPayment._directBilling_createOrder,
            async: false,
            cache: false,
            dataType: 'jsonp', contentType: 'text/javascript;charset=UTF-8',
            success: function (order) {
                if (ZPayment.boxTelcardValue) {
                    ZPayment.boxTelcardValue.hide();
                }
                if (typeof order === 'object') {
                    if (!order.error_code && order.redirectUrl) {
                        popup = 1;
                        if (typeof popup !== 'undefined' && popup) {
                            switch (popup) {
                                case 1:
                                    var boxwidth = 700, boxheight = 350;
                                    var html = '';
                                    html += '<div class="overlay">' +
                                        '<div class="box-popup no-padding">' +
                                        '<div class="popup-content">' +
                                        '<div>' +
                                        '<iframe id="iFpayment" marginwidth="0" marginheight="0" align="top" hspace="0" vspace="0" width="' + boxwidth + 'px" height="' + boxheight + 'px" frameBorder="0" src="' + order.redirectUrl + '" ></iframe>' +
                                        '</div>' +
                                        '</div>' +
                                        '<span class="close"></span>' +
                                        '</div>' +
                                        '</div>';
                                    ZPayment.boxPayTelcard = Boxy.show(html, {
                                        title: '', modal: true, afterShow: function () {
                                            $('#iFpayment').load(function () {
                                                var idFrame = $(this).attr('id');
                                                try {
                                                    var iframe = document.getElementById(idFrame).contentDocument || document.frames[idFrame].document;
                                                    href = iframe.location.href;
                                                    if (href) {
                                                        var $iframe = $('#' + idFrame);
                                                        if (href.indexOf('mp3.zing.vn')) {
                                                            if (ZPayment.boxPayTelcard)
                                                                ZPayment.boxPayTelcard.resize(580, 190);
                                                            $iframe.attr('width', 480).attr('height', 200);
                                                        }
                                                    }
                                                } catch (e) {
                                                }
                                            });
                                        }
                                    });
                                    break;
                                case 2:
                                    $(href).attr('href', order.redirect);
                                    href.click();
                                    break;
                                default:
                                    window.location.href = order.redirect;
                                    break;
                            }
                        } else {
                            window.location.href = order.redirect;
                        }
                    } else {
                        ZPayment.FMessage(0);
                    }
                }
            }, error: function (XMLHttpRequest, status, erThrown) {
                ZPayment.FMessage(0);
            }, complete: function (XMLHttpRequest, textStatus) {
                return true;
            }
        });
    },
	F123PayBank:function(params,popup,href){
		if(params === undefined) var params=[];
		var mTransactionID=gParam('mtrans');
		if(mTransactionID)
			params['mTransactionID']=mTransactionID;
		
		if(typeof params==='object'||typeof params==='array'){
			var par=[];
			for(i in params)par.push(i+'='+params[i]);
			params=par.join('&');
		}
		$.ajax({
			type:'JSON',url:ZPayment.domain+ZPayment._123pay_createOrder+'?'+params+'&callback=?',
			async: false,
			dataType:'jsonp',contentType:'text/javascript;charset=UTF-8',
			success:function(order){
				if(typeof ZPayment.boxBank!=='undefined' || ZPayment.boxBank){
					ZPayment.boxBank.hide();
				}
				if(typeof order==='object'){
					if(parseInt(order.error_code)===0 && typeof order.redirect!=='undefined'){
						if(typeof popup!=='undefined' && popup){
							switch(popup){
								case 1:
									var boxwidth=950,boxheight=510;
									var html='';
									html += '<div class="overlay">'+
												'<div class="box-popup no-padding">'+
													'<div class="popup-content">'+
														'<div>'+
															'<iframe id="iFpayment" marginwidth="0" marginheight="0" align="top" hspace="0" vspace="0" width="'+boxwidth+'px" height="'+boxheight+'px" frameBorder="0" src="'+order.redirect+'" ></iframe>'+
														'</div>'+
													'</div>'+
													'<span class="close"></span>'+
												'</div>'+
											'</div>';
									ZPayment.boxPayBank = Boxy.show(html,{title:'',modal:true,afterShow:function(){
										$('#iFpayment').load(function(){
											var idFrame=$(this).attr('id');
											try{
												var iframe = document.getElementById(idFrame).contentDocument||document.frames[idFrame].document;
												href = iframe.location.href;
												if(href){
													var $iframe=$('#'+idFrame);
													if(href.indexOf('mp3.zing.vn')){
														if(ZPayment.boxPayBank)
															ZPayment.boxPayBank.resize(580,190);
														$iframe.attr('width',480).attr('height',200);
													}
												}
											}catch(e){}
										});
									}});
									break;
								case 2:
									$(href).attr('href',order.redirect);
									href.click();
									break;
								default:
									window.location.href=order.redirect;
									break;
							}
						}else{
							window.location.href=order.redirect;
						}
					}else{
						ZPayment.FMessage(0);
					}
				}
			},error: function(XMLHttpRequest, status, erThrown){
				ZPayment.FMessage(0);
			},complete:function(XMLHttpRequest, textStatus){
				return true;
			}
		});
	},
	FViZingMe:function(params,back){
		if(params!==undefined){
			if(typeof params==='object'||typeof params==='array'){
				var par=[];
				for(i in params)par.push(i+'='+params[i]);
				par=par.join('&');
			}
			var surl=ZPayment.domain+ZPayment._viZingme+'?'+par+'&callback=?';
			$.ajax({
				type:'JSON',url:surl,
				dataType:'json',contentType:'text/javascript;charset=UTF-8',
				success:function(viZingme){
					if(viZingme!==undefined && typeof viZingme==='object' && viZingme.error_code === 0){
						var boxwidth=950,boxheight=510;
						$.ajax({
							type:'JSON',url:ZPayment.domain+ZPayment._vip_regist+'?'+par+'&callback=?',
							dataType:'json',contentType:'text/javascript;charset=UTF-8',
							success:function(data){
								if(data){
									if(data.error_code === 0){
										var html = '';
										html += '<div class="overlay">'+
													'<div class="box-popup no-padding">'+
														'<div class="popup-content">'+
															'<div>'+
																'<iframe id="credit" marginwidth="0" marginheight="0" align="top" hspace="0" vspace="0" width="'+boxwidth+'px" height="'+boxheight+'px" frameBorder="0" src="'+data.callback+'"></iframe>'+
															'</div>'+
														'</div>'+
														'<span class="close"></span>'+
													'</div>'+
												'</div>';
										ZVip.boxCredit=Boxy.show(html,{title:'',modal:true});
									}else{
										
									}
								}
							},error: function(XMLHttpRequest, status, erThrown){
								ZPayment.FMessage(0);
							}
						});
					}else{
						var html='';
						html += '<div class="overlay">'+
									'<div class="box-popup no-padding">'+
										'<div class="popup-content">'+
											'<p class="mb20"><strong>Thông báo</strong></p>'+
											'<div>'+'<p font-size: 1.1em; border:0; text-align: center;color: #888888;">'+viZingme.error_msg+'</p>'+'</div>'+
										'</div>'+
										'<span class="close"></span>'+
									'</div>'+
								'</div>';
						Boxy.show(
							html,{title:'',okButton:'Nạp tiền thêm',cancelButton:'Trở lại',
							afterShow:function(){this.resize(370, 250).resetHeight();}},{
							onOk:function(){
								if(viZingme.error_code===1){
									window.open(viZingme.url_vizingme);
								}
							},
							onCancel:function(event){
								back = back||false;
								ZVip.FpaymentMethod();
							}}
						);
					}
				},
				error: function(XMLHttpRequest, status, erThrown){
					ZVip.FMessage(0);
				}
			});
		}
	},
	FMessage:function(status,message){
		switch(status){
			case 1:
				var msg='',html='';
				if(message!==undefined) msg=message;
				else msg='Cám ơn bạn đã sử dụng dịch vụ VIP của Zing Mp3. <br>Vui lòng đăng nhập lại để kích hoạt.';
				html += '<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+
									'<p class="mb20"><strong>Giao dịch thành công</strong></p>'+
									'<p class="text-3 lh18 block-center">'+msg+'</p>'+
								'</div>'+
								'<div class="popup-footer">'+
									'<p class="info-more"><a href="http://mp3.zing.vn/vip">Tìm hiểu thêm về ưu đãi cho VIP</a></p>'+
								'</div>'+
							'</div>'+
						'</div>';
				Boxy.show(
					html,{title:'',okButton:'Đóng'},
					/*afterShow:function(){this.resize(390, 250).resetHeight()}},*/
					function onOk(){}
				);
				break;
			case 0:
				var msg='',html='';
				if(message !== undefined) msg=message;
				else msg='Mọi chi tiết giải đáp thắc mắc. <br>Bạn vui lòng liện hệ Website: <a href="http://hotro.zing.vn"><strong>Hỗ trợ</strong></a> hay Hotline:1900 561 558.';
				html += '<div class="overlay">'+
							'<div class="box-popup no-padding">'+
								'<div class="popup-content">'+
									'<p class="mb20"><strong>Giao dịch thất bại</strong></p>'+
									'<p class="text-3 lh18 block-center">'+msg+'</p>'+
								'</div>'+
								'<span class="close"></span>'+
							'</div>'+
						'</div>';
				Boxy.show(
					html,{title:'',okButton:'Đóng'},
					function onOk(){}
				);
				break;
		}
	}
};
var ZDisLibs={
	init:function(){},
	loadScript:function(source){
		if (source){
			//add script
			var script   = document.createElement("script");
			script.type  = "text/javascript";
			script.src   = source;
			document.body.appendChild(script);
			//remove from the dom
			//document.body.removeChild(document.body.lastChild);
			return true;
		} else {
			return false;
		}
	},
	extend:function(){
		if(typeof jQuery.getPathScript!=='function'){
			jQuery.getPathScript=function(filename){
				var scripts=document.getElementsByTagName('script');
				if(scripts && scripts.length >0){
					if(filename !== undefined){
						for(var i in scripts){
							if(scripts[i].src!==undefined && scripts[i].src){
								if(scripts[i].src.match(new RegExp(filename+'\\.js$'))){
									return scripts[i].src.replace(new RegExp('(.*)'+filename+'\\.js$'),'$1');
								}
							}
						}
					}else{
						return scripts;
					}
				}
				return null;
			};
		};
		if(typeof jQuery.getPathStyle!=='function'){
			jQuery.getPathStyle=function(filename){
				var styles=document.getElementsByTagName('link');
				if(styles && styles.length >0){
					if(filename !== undefined){
						for(var i in styles){
							if(styles[i].href!==undefined && styles[i].href){
								if(styles[i].href.match(new RegExp(filename+'\\.css$'))){
									return styles[i].href.replace(new RegExp('(.*)'+filename+'\\.css$'),'$1');
								}
							}
						}
					}else{
						return styles;
					}
				}
				return null;
			};
		};
		if(typeof jQuery.loadScript!=='function'){
			jQuery.loadScript=function(source){
				jQuery('<script>').appendTo('body').attr({type:'text/javascript',language:'javascript'}).attr('src',source);
				return this;
			};
		};
		if(typeof jQuery.gParam!=='function'){
			jQuery.gParam=function(name){
				name=name.replace(/[\[]/,'\\\[').replace(/[\]]/,'\\\]');
				var regexS='[\\?&]'+name+'=([^&#]*)',
				regex=new RegExp( regexS ),
				url=window.location.href;
				url=url.replace(/&amp;/g,'&');
				var results=regex.exec(url);
				if(results === null) return '';
				else return results[1];
			};
		};
	},
	loadLibs:function(){
		var pathScript = jQuery.getPathScript(ver);
		jQuery.loadScript(pathScript+'plugin/jquery.boxy.js');
		jQuery('<link>').appendTo('head').attr({type:'text/css',rel:'stylesheet'}).attr('href',pathScript+'plugin/boxy.css');
	}
};
function callbackPayment(billNo,step,result){
	switch(result){
		case -2:case -1:
			if(ZVip.boxCredit){
				ZVip.boxCredit.hide();
				ZVip.boxCredit = null;
			}
			break;
		case 0:
			if(ZVip.boxCredit){
				ZVip.boxCredit.hide();
				ZVip.boxCredit = null;
				ZVip.FMessage(1);
			}
			break;
	}
}
function gParam(name){
	name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var regexS = "[\\?&]"+name+"=([^&#]*)";
	var regex = new RegExp( regexS );
		var url = window.location.href;
	url = url.replace(/&amp;/g,'&');
	var results = regex.exec(url);
	if( results === null ) return '';
	else return results[1];
}
if(!window.jQuery){
ZDisLibs.loadScript("http://ajax.googleapis.com/ajax/libs/"+lib+"/"+verJq+"/"+lib+".min.js");
try{
	if(window.addEventListener){
		window.addEventListener('load',function(){
			jQuery.noConflict();$=window.jQuery=jQuery;
			ZDisLibs.extend();ZDisLibs.loadLibs();ZVip.init();
		},false);
	}else if(window.attachEvent){
		window.attachEvent('onload',function(){
			jQuery.noConflict();$=window.jQuery=jQuery;
			ZDisLibs.extend();ZDisLibs.loadLibs();ZVip.init();
		});
	}
}catch(e){}
}else{
try{
	$(document).ready(function (){
		ZDisLibs.extend();ZDisLibs.loadLibs();ZVip.init();
	});
}catch(e){}
}