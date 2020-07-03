$(function () {

    gsap.registerPlugin(ScrollTrigger);

    let $wrap = $('.b-hscroll');
    let $sections = $wrap.find('.b-hscroll-section');
    let visibleCount = 5;
    let scrollCount = $sections.length - visibleCount - 1;

    $sections.each(function (i, el) {
        $(this).text(i);
    });

    gsap.to($sections, {
        xPercent: -100 * scrollCount,
        ease: 'none',
        scrollTrigger: {
            trigger: $wrap[0],
            //endTrigger: $sections.last()[0],
            start: 'center center',
            //end: 'right right',
            //end: () => "+=" + $wrap.outerWidth(),
            pin: true,
            scrub: 1,
            snap: 1 / scrollCount,
            //onUpdate: ({progress, direction, isActive}) => console.log(progress, direction, isActive)
        }
    });

});


