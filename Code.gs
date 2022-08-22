function indomaret(keyword) {
  keyword = encodeURI(keyword);
  const url = `https://www.klikindomaret.com/search/?key=${keyword}`;
  let content = UrlFetchApp.fetch(url).getContentText().split('\n').join('');
  content = content.split('<div class="item">').filter((e,i)=>i>=4).map((e)=>{
    const item = e.split('<div class="wrp-btn">')[0];;
    let data = {};
    data = {
      'img' : item.split('<img class="lazy" data-src="')[1].split('"')[0],
      'title' : decodeURIComponent(item.split('<div class="title">')[1].split('</div>')[0].trim())
    } 
    data['lagidiskon'] = false;
    if (item.includes('<span class="discount">')) {
      data['lagidiskon'] = true;
      data['diskon'] = item.split('<span class="discount">')[1].split('</span>')[0];
      data['sebelumdiskon'] = item.split('<span class="strikeout disc-price">')[1].split('<span')[0];
      data['sebelumdiskon'] = rupiahToInt(data['sebelumdiskon']);
    }
    data['harga'] = item.split('<span class="normal price-value">')[1].split('</span>')[0];
    data['harga'] = rupiahToInt(data['harga']);
    return data;
  });
  return content;
}

function alfamart(keyword){
  keyword = encodeURI(keyword);
  const url = `https://alfagift.id/find/${keyword}`;
  let content = UrlFetchApp.fetch(url).getContentText().split('\n').join('');
  content = content.split('<div class="card product-card">').filter((e,i)=>i!=0).map((e)=>{
    const item = e.split('<div class="btn-act d-grid">')[0];
    if (item.includes('Harga tidak ditemukan di kota anda')) return;
    let data = {};
    data = {
      'img' : item.split('src="')[1].split('"')[0],
      'title' : decodeURIComponent(item.split('<p class="product-name">')[1].split('</p>')[0])
    }
    data['lagidiskon'] = false;
    
    if (item.includes('class="disc-label"')){
      data['lagidiskon'] = true;
      data['diskon'] = item.split('class="disc-label"')[1].split('>')[1].split('</div')[0];
      data['sebelumdiskon'] = item.split('currency-format="IDR"')[2].split('value="')[1].split('"')[0];
      data['harga'] = item.split('currency-format="IDR"')[1].split('value="')[1].split('"')[0];
      data['harga'] = parseInt(data['harga']);
    }else{
      data['harga'] = item.split('currency-format="IDR"')[1].split('value="')[1].split('"')[0];
      data['harga'] = parseInt(data['harga']);
    }

    return data;
  }).filter((e)=>e!=null);
  return content;
}

function rupiahToInt(rupiah){
  return parseInt(rupiah.trim().split('Rp ').join('').split('.').join(''));
}

function doGet(){
  return HtmlService.createHtmlOutputFromFile('index').setSandboxMode(HtmlService.SandboxMode.IFRAME).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL).addMetaTag('viewport', 'width=device-width, initial-scale=1 maximum-scale=1 user-scalable=0');
}

function olah(keyword){
  const data_indomaret = indomaret(keyword);
  const data_alfamart = alfamart(keyword);
  return{'indomaret' : data_indomaret, 'alfamart' : data_alfamart};
}
