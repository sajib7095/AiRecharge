const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

// public ফোল্ডার থেকে ফ্রন্টএন্ড ফাইল লোড করার জন্য
app.use(express.static(path.join(__dirname, 'public')));

app.get('/recharge', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    
    const number = req.query.number;
    const amount = req.query.amount;
    const type = req.query.type || 'Prepaid';

    if (!number || !amount) {
        return res.status(400).json({ status: "error", messege: "নম্বর এবং পরিমাণ প্রদান করুন।" });
    }

    const access_id = '01874746648';
    const access_key = 'e03a0f3e488554fa4d8fb5e32968b46d';
    
    // ডকুমেন্টস অনুযায়ী ফ্রেশ timestamp এবং ইউনিক request_id তৈরি
    const timestamp = Math.floor(Date.now() / 1000);
    const request_id = 'rc_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    const domain = req.get('host'); 

    const apiUrl = `https://sunnytech.top/app/api/topup.php?access_id=${encodeURIComponent(access_id)}&access_key=${encodeURIComponent(access_key)}&number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&type=${encodeURIComponent(type)}&domain=${encodeURIComponent(domain)}&timestamp=${timestamp}&request_id=${encodeURIComponent(request_id)}`;

    try {
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();
        return res.json(data);
    } catch (error) {
        return res.json({ status: "error", messege: "নেটওয়ার্ক ত্রুটি ঘটেছে।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```[cite: 1]

#### **৩. তৃতীয় ফাইল: `public/index.html`**
ফাইল তৈরির সময় ফাইলের নামের জায়গায় লিখবেন: `public/index.html` (এতে স্বয়ংক্রিয়ভাবে `public` ফোল্ডার তৈরি হয়ে যাবে)। এরপর নিচের ফর্মের কোডটি পেস্ট করে **Commit changes** দিন:
```html
<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>GitHub & Render Recharge Panel</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8fafc; padding: 40px; }
        .card { max-width: 400px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 13px; }
        input, select { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #cbd5e1; border-radius: 4px; }
        button { background: #4154f1; color: #fff; border: none; padding: 10px; width: 100%; border-radius: 4px; font-weight: bold; cursor: pointer; }
        button:hover { background: #2d3ec9; }
        #msg { margin-top: 15px; padding: 10px; font-size: 13px; border-radius: 4px; display: none; }
        .success { background: #dcfce7; color: #166534; }
        .error { background: #fee2e2; color: #991b1b; }
    </style>
</head>
<body>

<div class="card">
    <h2>অনলাইন রিচার্জ প্যানেল</h2>
    <div class="form-group">
        <label>মোবাইল নম্বর (১১ ডিজিট):</label>
        <input type="text" id="num" placeholder="01712345678">
    </div>
    <div class="form-group">
        <label>টাকা (সর্বনিম্ন ১০):</label>
        <input type="number" id="amt" placeholder="50" min="10">
    </div>
    <div class="form-group">
        <label>টাইপ:</label>
        <select id="typ">
            <option value="Prepaid">Prepaid</option>
            <option value="Postpaid">Postpaid</option>
            <option value="Skitto">Skitto</option>
        </select>
    </div>
    <button onclick="submitRecharge()">রিচার্জ করুন</button>
    <div id="msg"></div>
</div>

<script>
async function submitRecharge() {
    const number = document.getElementById('num').value;
    const amount = document.getElementById('amt').value;
    const type = document.getElementById('typ').value;
    const msgDiv = document.getElementById('msg');

    if(!number || !amount) {
        alert('দয়া করে নম্বর এবং পরিমাণ লিখুন।');
        return;
    }

    msgDiv.style.display = 'block';
    msgDiv.className = '';
    msgDiv.innerHTML = 'অপেক্ষা করুন, রিকোয়েস্ট পাঠানো হচ্ছে...';

    try {
        const response = await fetch(`/recharge?number=${encodeURIComponent(number)}&amount=${encodeURIComponent(amount)}&type=${encodeURIComponent(type)}`);
        const data = await response.json();

        if(data.status === 'success') {
            msgDiv.className = 'success';
            msgDiv.innerHTML = '✓ রিচার্জ সফল হয়েছে! মেসেজ: ' + (data.messege || 'Success');
        } else {
            msgDiv.className = 'error';
            msgDiv.innerHTML = '✗ ব্যর্থ হয়েছে: ' + (data.messege || 'Unknown Error');
        }
    } catch(err) {
        msgDiv.className = 'error';
        msgDiv.innerHTML = '✗ সংযোগে সমস্যা হয়েছে।';
    }
}
</script>

</body>
</html>
