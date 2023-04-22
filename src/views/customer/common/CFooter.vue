<template>
  <div class="bkc-footer">
    <div class="bkc-footer-content">
      <div class="footer-category-item">
        <div class="main-category mb-3">CHÍNH SÁCH GIÁ VÀ QUY ĐỊNH CHUNG</div>
        <div class="sub-category">
          <div
            class="sub-category-item"
            v-for="(child, i) in policyList"
            :key="i"
          >
            {{ child.name }}
          </div>
        </div>
      </div>
      <div class="footer-category-item">
        <div class="main-category mb-3">ĐỊA CHỈ</div>
        <div class="sub-category">
          <div
            class="sub-category-item"
            v-for="(child, i) in addressList"
            :key="i"
          >
            {{ child.name }}
          </div>
        </div>
      </div>
      <div class="footer-category-item">
        <div class="main-category mb-3">Fanpage</div>
        <iframe
          src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100089473405280&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
          width="340"
          height="300"
          style="border:none;overflow:hidden"
          scrolling="no"
          frameborder="0"
          allowfullscreen="true"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
    <div class="bkc-footer-end">
      Copyright © 2022 360ForMen. All Rights Reserved
    </div>
  </div>
</template>
    <script>
export default {
  name: "CFooter",
  data() {
    return {
      policyList: [
        { name: "Hướng Dẫn Mua Hàng" },
        { name: "Hình Thức Thanh Toán" },
        { name: "Quy Định Về Bảo Mật Thông Tin" },
        { name: "Chính Sách Bảo Hành" },
        { name: "Chính Sách Đổi Hàng" },
        { name: "Chính Sách Vận Chuyển" },
        { name: "Điều Khoản Dịch Vụ" },
        { name: "Giới Thiệu" },
      ],
      addressList: [
        {
          name: "459 Bạch Mai, Hai Bà Trưng, Hà Nội, Việt nam",
        },
        { name: "Facebook thời trang nam: 360ForMen" },
        { name: "Hotline: 0337877093" },
        { name: "Email: 360formen@gmail.com" },
        { name: "Website: https://360formen.netlify.app/" },
      ],
    };
  },
};
</script>
<style  scoped>
@import url("../../../css/customer/c-footer.css");
</style>
    
    