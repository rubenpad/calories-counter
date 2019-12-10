const compose = (...functions) => (data) =>
  functions.reduceRight((value, func) => func(value), data);

const $DESCRIPTION = document.getElementById('description');
const $CALORIES = document.getElementById('calories');
const $CARBS = document.getElementById('carbs');
const $PROTEINS = document.getElementById('proteins');
const $ADD = document.getElementById('add');

// State
let itemsList = [];

const attrsToString = (obj) => {
  return Object.keys(obj)
          .map((key) => ` ${key}="${obj[key]}"`)
          .join(' ');
};

const createTagWithAttrs = (obj) => (content = '') => {
  const { tag, attrs } = obj;
  return `<${tag}${attrs ? attrsToString(attrs) : ''}>${content}</${tag}>`
};

const createTag = (tag) => {
  return typeof tag === 'string' ? 
          createTagWithAttrs({ tag }) :
          createTagWithAttrs(tag);
};

const tableRowTag = createTag('tr');
const tableRow = (items) => compose(tableRowTag, tableCells)(items);
const tableCell = createTag('td');
const tableCells = (values) => values.map(tableCell).join(' ');

// Validate that the all the inputs have been filled.
const validateInputs = () => {
  if ($DESCRIPTION.value &&
      $CALORIES.value &&
      $CARBS.value &&
      $PROTEINS.value
    ) {
      addItem();
    } else {
      $DESCRIPTION.classList.add('is-invalid');
      $CALORIES.classList.add('is-invalid');
      $CARBS.classList.add('is-invalid');
      $PROTEINS.classList.add('is-invalid');
    }
};

// Update the totals in the table
const updateTotals = () => {
  let calories = 0, carbs = 0, proteins = 0;
  itemsList.map((item) => {
    calories += item.calories;
    carbs += item.carbs;
    proteins += item.proteins;
  });

  document.getElementById('total-calories').innerText = calories;
  document.getElementById('total-carbs').innerText = carbs;
  document.getElementById('total-proteins').innerText = proteins;
};

// Clear the inpust to enter new values.
const clearInputs = () => {
  $DESCRIPTION.value = '';
  $CALORIES.value = '';
  $CARBS.value = '';
  $PROTEINS.value = '';
};

// Add a item to the table.
const addItem = () => {
  const newItem = {
    description: $DESCRIPTION.value,
    calories: parseInt($CALORIES.value),
    carbs: parseInt($CARBS.value),
    proteins: parseInt($PROTEINS.value),
  };

  itemsList.push(newItem);
  clearInputs();
  updateTotals();
  renderItems();
};

// Rendet the items in the table.
const renderItems = () => {
  const $TBODY = document.getElementById('tbody');
  $TBODY.innerHTML = '';
  const rows = itemsList.map((item, index) => {
    const { description, calories, carbs, proteins } = item;
    const removeButton = createTag({
      tag: 'button',
      attrs: {
        class: 'btn btn-danger',
        onclick: `removeItem(${index})`
      }
    })('');
    
    return tableRow([
      description,
      calories,
      carbs,
      proteins,
      removeButton
    ]);
  });
  $TBODY.innerHTML = rows.join('');
};

const removeItem = (index) => {
  itemsList = itemsList.filter((item) => item !== itemsList[index]);
  updateTotals();
  renderItems();
};

$ADD.addEventListener('click', validateInputs);

$DESCRIPTION.addEventListener(
  'keydown', () => $DESCRIPTION.classList.remove('is-invalid'));
$CALORIES.addEventListener(
  'keydown', () => $CALORIES.classList.remove('is-invalid'));
$CARBS.addEventListener(
  'keydown', () => $CARBS.classList.remove('is-invalid'));
$PROTEINS.addEventListener(
  'keydown', () => $PROTEINS.classList.remove('is-invalid'));
