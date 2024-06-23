"use strict";

window.addEventListener('load', function () {
    console.log("Script is running");

    // Matter.js module aliases
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Events = Matter.Events;

    // Create an engine
    var engine = Engine.create();
    var world = engine.world;

    // Create a renderer
    var render = Render.create({
        element: document.getElementById('skills-container'),
        engine: engine,
        options: {
            width: document.getElementById('skills-container').clientWidth,
            height: document.getElementById('skills-container').clientHeight,
            wireframes: false,
            background: 'transparent'
        }
    });

    Render.run(render);

    // Create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // Create walls
    var walls = [
        Bodies.rectangle(render.options.width / 2, -10, render.options.width, 20, { isStatic: true }), // Top wall
        Bodies.rectangle(render.options.width / 2, render.options.height + 10, render.options.width, 20, { isStatic: true }), // Bottom wall
        Bodies.rectangle(-10, render.options.height / 2, 20, render.options.height, { isStatic: true }), // Left wall
        Bodies.rectangle(render.options.width + 10, render.options.height / 2, 20, render.options.height, { isStatic: true }) // Right wall
    ];
    Composite.add(world, walls);

    // Create skill chips
    var skillChips = document.querySelectorAll('.skill-chip');
    var matterBodies = [];

    skillChips.forEach(function (chip) {
        console.log('Creating chip for:', chip.textContent); // Debugging log
        var rect = chip.getBoundingClientRect();
        var body = Bodies.rectangle(rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, {
            render: {
                fillStyle: '#007bff'
            }
        });
        chip.style.display = 'block'; // Ensure visibility
        body.isStatic = true; // Make them static initially
        Composite.add(world, body);
        matterBodies.push({ element: chip, body: body });

        // Manual drag outside canvas
        chip.addEventListener('mousedown', function (e) {
            chip.style.position = 'absolute';
            chip.style.zIndex = 1000;

            function onMouseMove(event) {
                chip.style.left = event.pageX - chip.offsetWidth / 2 + 'px';
                chip.style.top = event.pageY - chip.offsetHeight / 2 + 'px';
            }

            document.addEventListener('mousemove', onMouseMove);

            chip.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                chip.onmouseup = null;
            };

            chip.ondragstart = function () {
                return false;
            };
        });

        // Ensure chips are visible and draggable
        body.render.sprite = {
            texture: chip.innerHTML,
            xScale: 1,
            yScale: 1
        };
    });

    // Add mouse control
    var mouse = Mouse.create(render.canvas);
    var mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: {
                visible: false
            }
        }
    });
    Composite.add(world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: render.options.width, y: render.options.height }
    });

    // Resize the canvas when the window is resized
    window.addEventListener('resize', function () {
        render.canvas.width = document.getElementById('skills-container').clientWidth;
        render.canvas.height = document.getElementById('skills-container').clientHeight;
        Composite.remove(world, walls);
        walls[0] = Bodies.rectangle(render.options.width / 2, -10, render.options.width, 20, { isStatic: true }); // Top wall
        walls[1] = Bodies.rectangle(render.options.width / 2, render.options.height + 10, render.options.width, 20, { isStatic: true }); // Bottom wall
        walls[2] = Bodies.rectangle(-10, render.options.height / 2, 20, render.options.height, { isStatic: true }); // Left wall
        walls[3] = Bodies.rectangle(render.options.width + 10, render.options.height / 2, 20, render.options.height, { isStatic: true }); // Right wall
        Composite.add(world, walls);
    });

    // Intersection Observer to detect when #skills-container is in view
    var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            // Release skill chips to fall into a pile
            matterBodies.forEach(function (matterBody) {
                console.log('Releasing chip for:', matterBody.element.textContent); // Debugging log
                matterBody.element.style.display = 'block'; // Make them visible
                matterBody.body.isStatic = false; // Release the chip to fall
            });
        }
    }, { threshold: 0.1 });

    observer.observe(document.getElementById('skills-container'));
});
