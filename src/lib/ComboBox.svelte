<svelte:options tag="combo-box"/>

<script lang="ts">
import { tick } from 'svelte'
import { fade } from 'svelte/transition'
export let data = []
let input = ''
let selectedValue = []
let status = 'blur'
let inputWidth = -1
let forKeyboard = {
    selectedIndex: -1
}
let dropdownDOM = undefined
let inputDOM = undefined
let targetArray = []

$: {
    if (Array.isArray(data)) {
        targetArray = data
    } else if (typeof data === 'string') {
        targetArray = JSON.parse(data)
    } else {
        console.warn('Invalid JSON string')
    }
}

$: filteredData = targetArray
    .filter(item=> !selectedValue.find((k: Record<'name'|'param', string>)=> k.param === item.param))
    .filter(item=> item.name.includes(input))

$: {
    if (status === 'blur' && forKeyboard.selectedIndex !== -1) {
        forKeyboard.selectedIndex = -1
    }
}

const pushIntoSelectedValue = (item: Record<'name'|'param', string>)=>{
    selectedValue = Object.values(
        [...selectedValue, item]
            .reduce((acc:Record<'name'|'param', string>, cur:Record<'name'|'param', string>)=> ({...acc, [cur.param]: cur}), {})
    )
}

const clearInput = ()=>{
    input = ''
}

const handleKeyDown = async(e)=>{
    try{
        switch (e.key) {
        case 'Escape':
            inputDOM.blur()
            break
        case 'Enter':
            if(forKeyboard.selectedIndex !== -1){
                pushIntoSelectedValue(filteredData[forKeyboard.selectedIndex])
            }

            inputDOM.blur()
            break
        case 'ArrowUp':
            forKeyboard.selectedIndex !== -1
                ?   forKeyboard.selectedIndex = (forKeyboard.selectedIndex - 1) % filteredData.length
                :   forKeyboard.selectedIndex = (forKeyboard.selectedIndex - 1) % filteredData.length

            if(forKeyboard.selectedIndex <= -1){
                forKeyboard.selectedIndex = filteredData.length - 1
            }
            
            await tick()
            if (dropdownDOM) {
                const active = dropdownDOM.querySelector('[data-selected="true"]')

                if (active) {
                    if (forKeyboard.selectedIndex === filteredData.length - 1) {
                        active.scrollIntoView()
                        return
                    }
                    if ((active.offsetTop % dropdownDOM.offsetHeight) - dropdownDOM.offsetHeight < dropdownDOM.scrollTop) {
                        active.scrollIntoView()
                    }
                }
            }
            
            break
        case 'ArrowDown':
            forKeyboard.selectedIndex !== -1
                ? forKeyboard.selectedIndex = (forKeyboard.selectedIndex + 1) % filteredData.length
                : forKeyboard.selectedIndex = 0

            await tick()
            if (dropdownDOM) {
                const active = dropdownDOM.querySelector('[data-selected="true"]')
                if (active) {
                    if (forKeyboard.selectedIndex === 0) {
                        active.scrollIntoView()
                        return
                    }
                    if ((active.offsetTop % dropdownDOM.offsetHeight)  + active.clientHeight > dropdownDOM.scrollTop + dropdownDOM.offsetHeight) {
                        active.scrollIntoView()
                    }
                }
            }

            break
        }
    }catch(err){
        console.log(err)
    }
}
</script>

<div class="combo-box">
    <div class="combo-box__wrapper" bind:offsetWidth={inputWidth}>
        {#each selectedValue as tag}
            <div class="combo-box__input-tag-wrapper">
                <button 
                    class="combo-box__input-tag-cross" 
                    on:mousedown={()=>{
                        selectedValue = selectedValue.filter(i=>i.param !== tag.param)
                    }}
                >x</button>
                <span class="combo-box__input-tag">
                    {tag.name}
                </span>
            </div>
        {/each}

        <input
            placeholder="Please enter keywords"
            id="combo-box"
            type="text"
            class="combo-box__input"
            role="combobox"
            aria-autocomplete="list"
            aria-controls="combo-box-dropdown"
            aria-expanded={status === 'focus'}
            aria-activedescendant={ forKeyboard.selectedIndex !== -1 ? `combo-box-option-${forKeyboard.selectedIndex}`: null }
            bind:value={input}
            bind:this={inputDOM}
            on:focus={()=> status = 'focus'}
            on:blur={()=> {
                status = 'blur'
                clearInput()
            }}
            on:keydown = {handleKeyDown}
        >
    </div>

    {#if status === 'focus'}
        <div 
            class="combo-box__dropdown"
            style:max-width={inputWidth+'px'}
            in:fade={{
                delay: 0,
                duration: 100
            }}
        >
            <ul class="combo-box__dropdown-ul" bind:this={dropdownDOM} id="combo-box-dropdown" role="listbox">
                {#if filteredData.length > 0}
                    {#each filteredData as county, index}
                        <li 
                            id="combo-box-option-{index}"
                            class="combo-box__dropdown-li"
                            class:selected={forKeyboard.selectedIndex === index}
                            class:combo-box__dropdown-li-keyboard-selected={forKeyboard.selectedIndex === index}
                            data-selected={forKeyboard.selectedIndex === index}
                            aria-setsize={ filteredData.length }
                            aria-posinset={ index + 1}
                            on:mousedown={()=> pushIntoSelectedValue(county)}
                        >{county.name}</li>
                    {/each}
                {:else if filteredData.length === 0}
                    <li class="combo-box__dropdown-li">無資料</li>
                {/if}
            </ul>
        </div>
    {/if}
</div>

<style lang="scss">
* {
    box-sizing: border-box;
}

.combo-box{
    position: relative;
    width: 100%;
}

.combo-box__wrapper{
    display: flex;
    overflow-x: hidden;
    width: 100%;
    max-width: 300px;
    border: 1px solid black;
    flex-wrap: wrap;

    .combo-box__input{
        padding: 0.25rem;
        margin: 0.25rem;
        border: 0;
        flex: 1 0 auto;
        &:focus{
            outline-color: #E5E5E5;
        }
    }

    .combo-box__input-tag-wrapper{
        display: flex;
        justify-content: center;
        align-items: baseline;
        margin: 0.25rem;
        background-color: #E5E5E5;
        border-radius: 4px;
        flex-wrap: wrap;
    }

    .combo-box__input-tag{
        display: inline-block;
        padding: 0.25rem;
        min-width: 3.75rem;
        max-width: 3.75rem;
        background-color: #E5E5E5;
        flex: 1 1 3.75rem;
        border-radius: 4px;
    }

    .combo-box__input-tag-cross{
        padding: 0 0.25rem;
        font-size: 1rem;
        background-color: #E5E5E5;
        border: 0;
        &:hover{
            cursor: pointer;
        }
    }
}

.combo-box__dropdown{
    position: absolute;
    z-index: 100;
    overflow-y: auto;
    margin-top: 10px;
    width:100%;
    border: 1px solid #000;
    
    .combo-box__dropdown-ul{
        padding-inline-start: 0;
        list-style-type: none;
        margin-block-start: 0;
        margin-block-end: 0;
        max-height: 200px;
    }

    .combo-box__dropdown-li{
        padding: 0.5rem 0;

        &:hover{
            background-color: gold;
        }

        &-keyboard-selected{
            background-color: gold;
        }
    }
}
</style>