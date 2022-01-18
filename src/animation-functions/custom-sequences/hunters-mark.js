import { AAanimationData } from "../../aa-classes/animation-data.js";
import { aaDebugger } from "../../constants/constants.js";

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function huntersMark(handler, animationData) {

    function moduleIncludes(test) {
        return !!game.modules.get(test);
    }

    const data = animationData.primary;
    if (data.isAuto) {
        const autoOverridden = handler.autoOverride?.enable
        data.anchorX = autoOverridden ? handler.autoOverride?.anchorX : data.anchorX || 0.5;
        data.anchorY = autoOverridden ? handler.autoOverride?.anchorY : data.anchorY || 0.7;
    }
    
    const sourceToken = handler.actorToken;
    let target = handler.allTargets[0] || null;

    const animLoop = data.variant + "loop";
    let hmPulse = data.color === 'random' ? `autoanimations.static.huntersmark.${data.variant}` : `autoanimations.static.huntersmark.${data.variant}.${data.color}`;

    let hmLoop = data.color === 'random' ? `autoanimations.static.huntersmark.${animLoop}` : `autoanimations.static.huntersmark.${animLoop}.${data.color}`

    const checkAnim = Sequencer.EffectManager.getEffects({ object: target, name: "huntersmark" }).length > 0

    const scale = data.scale || 1
    const finalScale = (canvas.grid.size / 200) * scale

    if (handler.debug) { aaDebugger("Aura Animation Start", data) }

    const playPersist = (!checkAnim && data.persistent) ? true : false;
    await new Sequence("Automated Animations")
        .sound()
            .file(data.itemAudio.file, true)
            .volume(data.itemAudio.volume)
            .delay(data.itemAudio.delay)
            .playIf(data.playSound)
        .effect()
            .file(hmPulse)
            .atLocation(sourceToken)
        .effect()
            .file(hmPulse)
            .atLocation(target)
            .playIf(target)
            .waitUntilFinished()
        .effect()
            .file(hmLoop)
            .attachTo(target)
            .anchor({ x: data.anchorX, y: data.anchorY })
            .playIf(playPersist)
            .scale(finalScale)
            .belowTokens(false)
            .name("huntersmark")
            .persist(true)
            .origin(handler.item.uuid)
        //.name(target.name)
        //.loopProperty("sprite", "rotation", { values: [0, 360], duration: 6000})
            .loopProperty("sprite", "scale.x", { from: (finalScale * 0.4), to: finalScale, duration: 4000, pingPong: true })
            .loopProperty("sprite", "scale.y", { from: (finalScale * 0.4), to: finalScale, duration: 4000, pingPong: true })
            .loopProperty("sprite", "alpha", { from: 0.25, to: 1, duration: 4000, pingPong: true })
        .play()
        //AAanimationData.removePersistentEffect(target, "huntersmark", canvas.scene.id)
        if (playPersist) { AAanimationData.howToDelete("sequencerground") }
}

export default huntersMark;