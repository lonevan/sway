/*! Copyright (c) 2011 lonevan (http://i.piupiupiu.com/lonevan)
* Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
* and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
*
* Version 0.1
*/
(function($){
    
    var monkey; // actually the 'absolute' tiny long div
    
    $.fn.sway = function(opt){
        new $.sway($(this),opt);
    }
    
    $.sway = function(ele,opt){
        var self = this;
        if(!ele.length){
            return false;
        }
        this.ele = ele;  // the branches
        
        opt = $.extend({
            cls: 'monkey', // the monkey class
            gravity: 'v', // or 'h'
            css: {
                position: 'absolute',
                width: 2, // or height: 2
                overflow: 'hidden',
                backgroundColor: '#659726'
            },
            tree: ele.parent(), // monkey sway in the tree
            duration: 300,
            stay: false,
            banana: false // may be a banana? eg: '.selected'
        },opt || {});
        
        this.opt = opt;
        
        var tree = $(opt.tree), // opt.tree can be String or jQuery Object or else
            monkey = $('<div class="'+opt.cls+'"></div>').css(opt.css).appendTo(tree);
            
        this.opt.tree = tree;    
        this.monkey = monkey;
        
        // if there is a banana, monkey stay in there
        var b = $(opt.banana,tree);
        if(b.length > 0){
            this.banana = b;
            
            var c = {},
                e = {},
                p = b.position(),
                tp = tree.position(),
                l,
                t;
            if(opt.gravity == 'v'){
                l = tp.left,
                t = p.top + parseInt(b.css('padding-top')) + parseInt(b.css('margin-top')) + parseInt(b.css('padding-bottom')) + parseInt(b.css('margin-bottom'));
                e.height = b.height();
                e.top = t;
                c.top = t + e.height/2;
                c.left = l;
                
            }else{
                l = b.position().left;
                t = tp.top + tree.innerHeight();
                e.width = b.width();
                e.left = l;
                c.left = l + e.width/2;
                c.top = t;
            }
            monkey.css(c).data('inited',true).animate(e, 300);
            
            // monkey back to banana
            tree.mouseleave(function(){
                swayIn.call(self,self.banana);
            });
        }
        
        tree.on('mouseenter',ele.selector,function(){
            if(tree.data('swaying')){
                clearTimeout(tree.data('swaying'));
            }
            swayIn.call(self,this);
        });
        
        tree.on('mouseleave',ele.selector,function(){
            var e = this;
            tree.data('swaying',setTimeout(function(){
                swayOut.call(self,e);
            },300));
        });
    };
    
    function swayIn(ele){
        var ele = $(ele), opt = this.opt, tree = opt.tree, monkey = this.monkey;
        var p = ele.position(),
            tp = tree.position(),
            l,
            t;
        var c={}, e = {};
        if(opt.gravity == 'v'){
            l = tp.left,
            t = p.top + parseInt(ele.css('margin-top')) + parseInt(ele.css('margin-bottom'));
            e.height = ele.innerHeight();
            e.top = t;
            c.top = t + e.height/2;
            c.left = l;
            
        }else{
            l = ele.position().left;
            t = tp.top + tree.innerHeight();
            e.width = ele.width();
            e.left = l;
            c.left = l + e.width/2;
            c.top = t;
        }
        
        if(!monkey.data('inited')){
            monkey.css(c).data('inited',true);
        }
        
        monkey.stop().animate(e, 300);
    }
    
    function swayOut(ele){
        if(this.opt.stay || this.banana){
            return;
        }
        var ele = $(ele), opt = this.opt, monkey = this.monkey;
        var mp = monkey.position(),
            e = {};
        if(opt.gravity == 'v'){
            e.top = mp.top + ele.height()/2;
            e.height = 0;
        }else{
            e.left = mp.left + ele.width()/2;
            e.width = 0;
        }
        monkey.stop().animate(e,300);
    }
    
})(jQuery);
