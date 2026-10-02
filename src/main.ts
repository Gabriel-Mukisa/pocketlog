import './style.css'

interface Expense {

    id: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
    currency: 'UGX' | 'USD'
}

const expenses: Expense[] = [];

function formatCurrency(amount: number, currency: 'UGX' | 'USD'): string {

    return new Intl.NumberFormat('en-UG', {

        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount);
}

function calculateTotal(): { UGX: number; USD: number } {

    return expenses.reduce((totals, expense) => {
        totals[expense.currency] += expense.amount;
        return totals;
    }, { UGX: 0, USD: 0 });
}

function renderSummary(): void {

    const totalSpending = document.getElementById('totalSpending');
    
    if (!totalSpending) return;

    const totals = calculateTotal();

    totalSpending.innerHTML = `
        <span>${ formatCurrency(totals.UGX, 'UGX') }</span>
        <span>${ formatCurrency(totals.USD, 'USD') }</span>
    `
}

function addExpense(expense: Expense): void {
    expenses.push(expense);
    renderExpenses();
    renderSummary();
}

function renderExpenses(): void {
    const expenseList = document.getElementById('expenseList');

    if (!expenseList) return;

    const expenseHTML = expenses.map(expense => {
        
        return `
            
            <article class="expenseCard">
                <h2>${ expense.description }</h2>
                <p>Amount: ${ formatCurrency(expense.amount, expense.currency) }</p>
                <p>Category: ${ expense.category }</p>
                <p>Date: ${ expense.date }</p>
            </article>
        `
    });

    expenseList.innerHTML = expenseHTML.join('');

}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <main>
        <h1>PocketLog</h1>

        <section id="summary">
            <h2>Total Spending</h2>
            <p id="totalSpending">UGX 0</p>
        </section>

        <section id="expenseList"></section>

        <form id="expenseForm">
            <input type="text" placeholder="Description" id="description" required />

            <select id="currency" required>
                <option value="UGX">UGX</option>
                <option value="USD">USD</option>
            </select>

            <input type="number" placeholder="Amount" id="amount" required />
            <input type="text" placeholder="Category" id="category" required />
            <input type="date" id="date" required />
            
            <button type="submit">Add Expense</button>
        </form>
    </main>
    `;

    const form = document.getElementById('expenseForm') as HTMLFormElement;

    form?.addEventListener('submit', (event) => {

        event.preventDefault();

        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const currencyInput = document.getElementById('currency') as HTMLSelectElement;
        const amountInput = document.getElementById('amount') as HTMLInputElement;
        const categoryInput = document.getElementById('category') as HTMLInputElement;
        const dateInput = document.getElementById('date') as HTMLInputElement;

        const expense: Expense = {

            id: crypto.randomUUID(),
            description: descriptionInput.value,
            currency: currencyInput.value as 'UGX' | 'USD',
            amount: parseFloat(amountInput.value),
            category: categoryInput.value,
            date: new Date(dateInput.value)
        };

        addExpense(expense);

        form.reset();
    });