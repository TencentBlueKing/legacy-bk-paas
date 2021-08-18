function switchLogin(evt, index) {
    var i, texts, labels, qrcode, normal, qr_tip, normal_tip
    labels = document.getElementsByClassName("login-tab-label")
    texts = document.getElementsByClassName("login-tab-text")
    for (i=0; i < labels.length; i ++) {
        labels[i].className = labels[i].className.replace(" label-active", "")
    }
    labels[index].className += " label-active"

    for (i=0; i < texts.length; i ++) {
        texts[i].className = texts[i].className.replace("text-active", "")
    }
    texts[index].className += " text-active"
    
    qrcode = document.getElementById('qr_login')
    qr_tip = document.getElementById('qr-login-error-tip')
    normal = document.getElementById('normal_login')
    normal_tip = document.getElementById('login-error-tip')
    if (index === 0) {
        qrcode.style.display = 'block'
        qr_tip.style.display = 'block'
        normal.style.display = 'none'
        normal_tip.style.display = 'none'
    } else {
        qrcode.style.display = 'none'
        qr_tip.style.display = 'none'
        normal.style.display = 'block'
        normal_tip.style.display = 'block'
    }

  }