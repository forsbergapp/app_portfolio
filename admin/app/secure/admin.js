<script>

        document.getElementById('menu_1_content').style.display = 'block';
        document.getElementById('menu_1').addEventListener('click', function() { show_menu(1) }, false);
        document.getElementById('menu_2').addEventListener('click', function() { show_menu(2) }, false);
        document.getElementById('menu_3').addEventListener('click', function() { show_menu(3) }, false);
        document.getElementById('menu_4').addEventListener('click', function() { show_menu(4) }, false);
        document.getElementById('menu_5').addEventListener('click', function() { admin_logout() }, false);
        document.getElementById('menu_1_content_widget').innerHTML = 'One';
        document.getElementById('menu_2_content_widget').innerHTML = 'Two';
        document.getElementById('menu_3_content_widget').innerHTML = 'Three';
        document.getElementById('menu_4_content_widget').innerHTML = 'Four';
    function admin_logout(){
        document.getElementById('menu_1').removeEventListener('click', function() { show_menu(1) }, false);
        document.getElementById('menu_2').removeEventListener('click', function() { show_menu(2) }, false);
        document.getElementById('menu_3').removeEventListener('click', function() { show_menu(3) }, false);
        document.getElementById('menu_4').removeEventListener('click', function() { show_menu(4) }, false);
        document.getElementById('menu_5').removeEventListener('click', function() { admin_login() }, false);
        document.getElementById('menu_1_content_widget').innerHTML = '';
        document.getElementById('menu_2_content_widget').innerHTML = '';
        document.getElementById('menu_3_content_widget').innerHTML = '';
        document.getElementById('menu_4_content_widget').innerHTML = '';
        document.getElementById('dialogue_login').style.visibility = 'visible';
        document.getElementById('secure').style.visibility = 'hidden';
        document.getElementById('secure').innerHTML = '';
    }
    function show_menu(menu){
        document.getElementById('menu_1_content').style.display='none';
        document.getElementById('menu_2_content').style.display='none';
        document.getElementById('menu_3_content').style.display='none';
        document.getElementById('menu_4_content').style.display='none';
        document.getElementById(`menu_${menu}_content`).style.display='block';
    }
</script>
