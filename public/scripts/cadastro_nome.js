document.addEventListener('DOMContentLoaded', function() {
    

   
    const form = document.getElementById('form-cadastro-livro');
    const raInput = document.getElementById('cadastro-isbn-livro');
    const raError = document.getElementById('is-error');

    
    form.addEventListener('submit', function(event) {
        
        const clickedButton = event.submitter;

       
        raError.textContent = '';

        if (clickedButton.id === 'cad') {
            
           

            const raValue = raInput.value.trim();
            
           
            if (!/^\d{13}$/.test(raValue)) {
                
                
                event.preventDefault(); 
                
               
                raError.textContent = 'O RA deve conter exatamente 13 dígitos numéricos.';
            }
        }
        
       
    });
});
